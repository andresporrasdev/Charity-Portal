import React from "react";
import "./Membership.css";

function Membership() {
  return (
    <div className="membership-container">
      <div className="membership-header">
        <h1>Become a Member!</h1>
        <p>Join our growing family!</p>
        <p> There are tons of benefits for becoming a member, hope you join us in our adventures!</p>
      </div>
      <div className="membership-content">
        <section>
          <h2>Benefits of Becoming a Member</h2>
          <p>
            By becoming an Member you could enjoy the following (but not limited to) privileges:
          </p>
          <ul>
            <li>Reduced Entry fee for the following  Events:</li>
            <ul>
              <li>January (New Year)</li>
              <li>April (New Year)</li>
              <li>July (Picnic)</li>
              <li>December (Christmas)</li>
              <li>And many more to come</li>
            </ul>
            <li>
              Up to 15% reduction in ticket costs for movies activities released in Ottawa if purchased through the Charity Organization Portal
            </li>
            <li>
              Attend Annual General Body Meetings and hold Voting Rights to nominate/elect executive committee members
              of the charity Organization
            </li>
          </ul>
        </section>
        <section>
          <h2>Membership Fees</h2>
          <ul>
            <li>Individual $20</li>
            <li>Student $10</li>
            <li>Couple $30</li>
            <li>Family $45</li>
          </ul>
        </section>
        <section>
          <h2>Membership Registration</h2>
          <p>
            We encourage everyone to buy membership to save and to support the community events (Option 1). You can also
            purchase tickets just for the event (Option 2).
          </p>
          <p>
            <strong>Option 1:</strong> For annual membership purchase{" "}
            <a href="https://www.eventbrite.ca">
              Click here
            </a>
            . The event ticket links will be sent through a separate email after the membership purchase.
          </p>
          <p>
            <strong>Option 2:</strong> If you wish to purchase the New Year Event ticket
            alone, wait for few more days…
          </p>
        </section>
      </div>
    </div>
  );
}

export default Membership;
