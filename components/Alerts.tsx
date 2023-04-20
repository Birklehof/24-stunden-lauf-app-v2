import useAlerts from "@/lib/hooks/useAlerts";
import useAuth from "@/lib/hooks/useAuth";

export default function Alerts() {
  const { isLoggedIn } = useAuth();
  const { alerts, addAlert } = useAlerts();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <div className="toast">
        {alerts.map((alert) => (
          <div className="alert alert-info" key={alert.id}>
            <div>
              <h1>{alert.title}</h1>
              <p>{alert.message}</p>
              <button onClick={() => removeAlert(alert.id)}>Close</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
