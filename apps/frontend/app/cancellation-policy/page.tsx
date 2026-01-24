export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Cancellation and Shipping Policy
          </h1>
          <p className="text-gray-600">Last updated: January 25, 2026</p>
        </div>

        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p className="mb-4">
              This Cancellation and Shipping Policy governs the cancellation of
              tournament registrations and the delivery of tournament-related
              materials for Walle Arena (&quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;). This policy is in compliance with the Consumer
              Protection (E-commerce) Rules, 2020.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Registration Cancellation Policy
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-4">
              2.1 Cancellation by Player
            </h3>
            <p className="mb-4">
              As a registered player, you may cancel your tournament
              registration under the following conditions:
            </p>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
              <h4 className="font-semibold mb-2">Cancellation Timeline:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>More than 30 days before tournament:</strong> 70%
                  refund (30% cancellation charge)
                </li>
                <li>
                  <strong>15-30 days before tournament:</strong> 30% refund (70%
                  cancellation charge)
                </li>
                <li>
                  <strong>Less than 15 days before tournament:</strong> No
                  refund (100% cancellation charge)
                </li>
                <li>
                  <strong>After tournament commencement:</strong> No refund or
                  cancellation allowed
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              2.2 How to Cancel Your Registration
            </h3>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>
                Send a cancellation request email to{" "}
                <strong>support@wallearena.com</strong>
              </li>
              <li>
                Include in your email:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your full name and player ID</li>
                  <li>Registered email address and phone number</li>
                  <li>Reason for cancellation</li>
                  <li>Razorpay payment ID (if applicable for refund)</li>
                </ul>
              </li>
              <li>
                You will receive an acknowledgment within 48 hours of submission
              </li>
              <li>
                Cancellation will be processed within 3-5 business days, and
                applicable refund (if any) will be initiated as per our Refund
                Policy
              </li>
            </ol>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              2.3 Cancellation by Walle Arena
            </h3>
            <p className="mb-4">
              Walle Arena reserves the right to cancel your registration in the
              following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Failure to complete payment within the specified deadline</li>
              <li>
                Submission of fraudulent, incomplete, or inaccurate information
              </li>
              <li>Violation of tournament rules or code of conduct</li>
              <li>
                Failure to submit required documents within the stipulated time
              </li>
              <li>
                Tournament cancellation or force majeure events (full refund
                will be issued)
              </li>
            </ul>
            <p className="mb-4">
              If we cancel your registration due to reasons attributable to you
              (fraud, incomplete information, rule violations), no refund will
              be issued. If cancellation is due to our inability to conduct the
              tournament, a full refund will be processed within 7-10 business
              days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. Tournament Materials Shipping Policy
            </h2>

            <h3 className="text-xl font-semibold mb-3 mt-4">
              3.1 What We Ship
            </h3>
            <p className="mb-4">
              Upon successful registration and payment confirmation, you will
              receive the following items before or during the tournament:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Jersey Kit:</strong> Official tournament jersey with
                your name and number
              </li>
              <li>
                <strong>Player ID Card:</strong> Laminated player identification
                card
              </li>
              <li>
                <strong>Tournament Kit:</strong> Additional items as announced
                (may include caps, wristbands, etc.)
              </li>
              <li>
                <strong>Welcome Pack:</strong> Tournament schedule, rules
                booklet, and sponsor materials
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              3.2 Delivery Method and Timeline
            </h3>
            <p className="mb-4">We offer two delivery methods:</p>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded mb-4">
              <h4 className="font-semibold mb-2">
                Option 1: In-Person Collection (Recommended)
              </h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Collect your tournament kit on the registration day at the
                  venue
                </li>
                <li>Date and venue will be communicated via email and SMS</li>
                <li>
                  Bring a valid government-issued photo ID for verification
                </li>
                <li>
                  Collection window: 2-3 days before tournament commencement
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded mb-4">
              <h4 className="font-semibold mb-2">
                Option 2: Home Delivery (if applicable)
              </h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Available for outstation players (subject to availability and
                  additional charges)
                </li>
                <li>
                  Delivery charges: ₹200-₹500 depending on location (to be paid
                  separately)
                </li>
                <li>Estimated delivery time: 7-10 business days</li>
                <li>
                  Shipped via reputable courier services (Delhivery, Blue Dart,
                  India Post)
                </li>
                <li>
                  Tracking ID will be shared via email once shipment is
                  dispatched
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              3.3 Shipping Address
            </h3>
            <p className="mb-4">
              If you opt for home delivery, ensure that the shipping address
              provided during registration is:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Complete with house/flat number, street name, and landmark
              </li>
              <li>Includes a valid PIN code</li>
              <li>
                Accompanied by an active phone number for delivery coordination
              </li>
            </ul>
            <p className="mb-4">
              <strong>Address Changes:</strong> You can request an address
              change up to 7 days before shipment dispatch by emailing{" "}
              <strong>support@wallearena.com</strong>. Address changes after
              dispatch are not possible.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              3.4 Shipment Tracking
            </h3>
            <p className="mb-4">
              Once your tournament kit is dispatched, you will receive:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Email notification with courier partner name and tracking ID
              </li>
              <li>SMS alert with tracking link</li>
              <li>
                Estimated delivery date (actual delivery may vary by 1-2 days)
              </li>
            </ul>
            <p className="mb-4">
              You can track your shipment using the tracking ID on the
              courier&apos;s website or mobile app.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              3.5 Delivery Issues
            </h3>
            <p className="mb-4">
              If you encounter any delivery issues, please contact us
              immediately:
            </p>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
              <h4 className="font-semibold mb-2">Common Delivery Issues:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Non-delivery:</strong> If shipment shows
                  &quot;delivered&quot; but you haven&apos;t received it, check
                  with family members or neighbors. Contact us within 48 hours
                  with tracking details.
                </li>
                <li>
                  <strong>Delayed delivery:</strong> If delivery exceeds
                  estimated timeline by 3+ days, email us with tracking ID for
                  investigation.
                </li>
                <li>
                  <strong>Damaged package:</strong> Do not accept damaged
                  packages. Refuse delivery and immediately inform us with
                  photos of the damaged packaging.
                </li>
                <li>
                  <strong>Wrong items:</strong> If you receive incorrect items,
                  notify us within 48 hours with photos and order details for
                  replacement.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Jersey Customization and Sizing
            </h2>
            <p className="mb-4">
              Your jersey will be customized with your name and preferred number
              based on the information provided during registration.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Customization deadline:</strong> Jersey details must be
                finalized at least 15 days before the tournament. Changes after
                this deadline cannot be accommodated.
              </li>
              <li>
                <strong>Size exchange:</strong> If the jersey size doesn&apos;t
                fit, you may request a size exchange at the venue during
                registration day, subject to availability.
              </li>
              <li>
                <strong>Name/Number errors:</strong> If there&apos;s an error in
                your name or number due to our mistake, we will provide a
                replacement jersey within 2-3 days.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              5. Non-Shippable Situations
            </h2>
            <p className="mb-4">
              We may not be able to ship tournament materials in the following
              cases:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Registration payment not completed or payment verification
                pending
              </li>
              <li>
                Required documents (photo, ID proof) not submitted or rejected
              </li>
              <li>
                Incorrect or incomplete shipping address provided (for home
                delivery)
              </li>
              <li>Remote locations not serviceable by courier partners</li>
              <li>Force majeure events or logistical disruptions</li>
            </ul>
            <p className="mb-4">
              In such cases, you will be notified via email/SMS, and in-person
              collection will be the default option.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Force Majeure and Tournament Postponement
            </h2>
            <p className="mb-4">
              In the event of unforeseen circumstances such as natural
              disasters, pandemics, government restrictions, or other force
              majeure events:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                The tournament may be postponed or cancelled at Walle
                Arena&apos;s discretion
              </li>
              <li>
                If postponed, your registration will remain valid for the new
                tournament dates
              </li>
              <li>
                If cancelled, a full refund will be issued within 10-15 business
                days
              </li>
              <li>
                Shipping of tournament materials will be adjusted based on the
                revised schedule
              </li>
            </ul>
            <p className="mb-4">
              Walle Arena will not be liable for any indirect, consequential, or
              incidental damages arising from tournament cancellation or
              postponement due to force majeure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Digital Delivery (Documents and Confirmations)
            </h2>
            <p className="mb-4">
              In addition to physical items, you will receive digital materials
              via email:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Immediate (within 24 hours of payment):</strong>{" "}
                Registration confirmation email, payment receipt, player ID
              </li>
              <li>
                <strong>7 days before tournament:</strong> Tournament schedule,
                venue details, team allocation, rules and regulations
              </li>
              <li>
                <strong>1 day before tournament:</strong> Final reminder,
                reporting time, last-minute updates
              </li>
            </ul>
            <p className="mb-4">
              Ensure that you check your email regularly (including spam/junk
              folders) and whitelist <strong>support@wallearena.com</strong> to
              receive all communications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              8. Contact Us for Cancellation or Shipping Queries
            </h2>
            <p className="mb-4">
              For any questions or concerns regarding cancellations or shipping,
              please reach out to us:
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p>
                <strong>Walle Arena</strong>
              </p>
              <p className="mt-2">
                <strong>Address:</strong>
                <br />
                304 Floor 3, 28 Devdarshan Enterprises
                <br />
                Agiary Lane, Zaveri Bazar, Kalbadevi
                <br />
                Mumbai, Maharashtra 400002, India
              </p>
              <p className="mt-2">Email: support@wallearena.com</p>
              <p>Phone: +91 9833208066 (Mon-Fri, 10 AM - 6 PM IST)</p>
              <p>
                Website:{" "}
                <a
                  href="https://www.wallearena.com"
                  className="text-blue-600 hover:underline"
                >
                  www.wallearena.com
                </a>
              </p>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              We aim to acknowledge all cancellation and shipping queries within
              48 hours and resolve them within 7 business days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Changes to This Policy
            </h2>
            <p className="mb-4">
              Walle Arena reserves the right to update this Cancellation and
              Shipping Policy at any time. Changes will be posted on our website
              with an updated &quot;Last updated&quot; date. Your continued
              participation after changes are made constitutes acceptance of the
              revised policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
