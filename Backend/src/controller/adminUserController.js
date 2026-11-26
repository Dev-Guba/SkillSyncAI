import {
    listUsers,
    createAccount,
    changeRole,
    setActive,
    sendPasswordReset,
    deleteAccount,
    listActions,
} from "../services/adminUserServices.js";

// Turns service errors (with .status) into JSON responses
function handler(fn, failMessage) {
    return async (req, res) => {
        try {
            const data = await fn(req);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            if (!error.status) console.error(`${failMessage}:`, error);
            return res.status(error.status || 500).json({
                success: false,
                message: error.status ? error.message : `${failMessage}. Please try again.`,
            });
        }
    };
}

const adminFrom = (req) => ({ user_id: req.user.user_id, username: req.user.username });

export const getAllAccounts = handler(() => listUsers(), "Couldn't load accounts");

export const postAccount = handler(
    (req) => createAccount(adminFrom(req), req.body || {}),
    "Couldn't create the account"
);

export const patchRole = handler(
    (req) => changeRole(adminFrom(req), req.params.user_id, req.body?.role_id),
    "Couldn't change the role"
);

export const patchStatus = handler(
    (req) => setActive(adminFrom(req), req.params.user_id, req.body?.active),
    "Couldn't change the account status"
);

export const postPasswordReset = handler(
    (req) => sendPasswordReset(adminFrom(req), req.params.user_id),
    "Couldn't send the reset email"
);

export const removeAccount = handler(
    (req) => deleteAccount(adminFrom(req), req.params.user_id, req.body?.confirm_username),
    "Couldn't delete the account"
);

export const getActions = handler(
    (req) => listActions(req.query.limit),
    "Couldn't load the action log"
);
