export default function Homepage() {
  return (
    <>
      <h1>Booking System</h1>
      <h3>Task Description | Requirements</h3>
      <ol>
        <li> You need to do Booking System.</li>
        <li>
          Technologies (you can choose):
          <ul>
            <li>Front-end: React, React Native, Next.js</li>
            <li>Back-end: Nest.js, Express.js, Next.js, Node.js,</li>
            <li>Database: PostgreSQL, MongoDB, MySQL</li>
          </ul>
        </li>
        <li>
          Requirements:
          <ul>
            <li>Ability to create, edit, delete, and view users.</li>
            <li>
              2 types of users: client and business (added admin for user)
            </li>
            <li>
              Clients should be able to view a list of business users and make
              appointments with them. Date, time and duration.
            </li>
            <li>
              Clients should also have the ability to see and manage their own
              appointments (cancel or reschedule them).
            </li>
          </ul>
        </li>
        <li>You need to deploy your results and share git repository.</li>
      </ol>
    </>
  );
}
