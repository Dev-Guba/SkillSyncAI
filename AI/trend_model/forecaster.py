
import numpy as np
from sklearn.linear_model import LinearRegression


def forecast_skill_demand(history, periods=36):
    """
    Forecast future skill demand using linear regression.

    history:
        [
            {"month": "2026-08", "demand": 1},
            {"month": "2026-09", "demand": 2}
        ]

    periods:
        Number of future months to forecast.
        Default: 36 months (3 years).
    """

    if not history or len(history) < 2:
        return []

    # Sort historical records chronologically
    history = sorted(
        history,
        key=lambda x: x["month"]
    )

    y = np.array(
        [item["demand"] for item in history],
        dtype=float
    )

    X = np.arange(
        len(y)
    ).reshape(-1, 1)

    # Train regression model
    model = LinearRegression()
    model.fit(X, y)

    # Forecast next 36 months
    future_X = np.arange(
        len(y),
        len(y) + periods
    ).reshape(-1, 1)

    predictions = model.predict(future_X)

    predictions = np.maximum(
        predictions,
        0
    )

    # Get the latest historical month
    last_month = np.datetime64(
        history[-1]["month"],
        "M"
    )

    results = []

    for index, prediction in enumerate(
        predictions,
        start=1
    ):
        future_month = (
            last_month +
            np.timedelta64(index, "M")
        )

        results.append({
            "month": str(future_month),
            "predicted_demand": round(
                float(prediction),
                2
            )
        })

    return results
