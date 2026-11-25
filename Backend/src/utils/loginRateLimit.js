/*
| Limits failed logins to slow down password guessing. Kept in memory, so it
| resets when the server restarts (fine for one server; a shared store such
| as Redis would be needed with several).
|
|  - 5 failed attempts for one username from one IP -> wait 15 minutes
|  - 20 failed attempts from one IP across any usernames -> wait 15 minutes
| A successful login clears that username's failures.
*/
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_USERNAME = 5;
const MAX_PER_IP = 20;

const failures = new Map(); // key -> [timestamps]

function recent(key) {
    const now = Date.now();
    const list = (failures.get(key) || []).filter((t) => now - t < WINDOW_MS);
    if (list.length) failures.set(key, list);
    else failures.delete(key);
    return list;
}

const userKey = (ip, username) => `u:${ip}:${String(username).trim().toLowerCase()}`;
const ipKey = (ip) => `ip:${ip}`;

// Returns seconds to wait, or 0 if the attempt may go ahead
export function loginBlockedFor(ip, username) {
    const checks = [
        [recent(userKey(ip, username)), MAX_PER_USERNAME],
        [recent(ipKey(ip)), MAX_PER_IP],
    ];

    let wait = 0;
    for (const [list, max] of checks) {
        if (list.length >= max) {
            const unblockAt = list[list.length - max] + WINDOW_MS;
            wait = Math.max(wait, Math.ceil((unblockAt - Date.now()) / 1000));
        }
    }
    return wait;
}

export function recordLoginFailure(ip, username) {
    const now = Date.now();
    for (const key of [userKey(ip, username), ipKey(ip)]) {
        failures.set(key, [...recent(key), now]);
    }

    // keep memory bounded
    if (failures.size > 20000) {
        failures.delete(failures.keys().next().value);
    }
}

export function clearLoginFailures(ip, username) {
    failures.delete(userKey(ip, username));
}
