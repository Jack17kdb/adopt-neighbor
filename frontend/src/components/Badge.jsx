export default function Badge({ status, type }) {
  const cls = type ? `badge badge-${type}` : `badge badge-${status}`;
  return <span className={cls}>{status || type}</span>;
}
