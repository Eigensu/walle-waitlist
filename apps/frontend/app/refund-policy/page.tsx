export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Refund and Return Policy</h1>
          <p className="text-gray-600">Last updated: January 25, 2026</p>
        </div>

        <div className="prose prose-sm max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p className="mb-4">
              This Refund and Return Policy outlines the conditions under which
              Walle Arena (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
              processes refunds for tournament registration fees. This policy
              complies with the Consumer Protection (E-commerce) Rules, 2020 and
              guidelines set forth by our payment partner, Razorpay.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Eligibility for Refund
            </h2>
            <p className="mb-4">
              You may be eligible for a refund in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Tournament Cancellation:</strong> If the tournament is
                cancelled by Walle Arena, a full refund will be issued to all
                registered players.
              </li>
              <li>
                <strong>Duplicate Payment:</strong> If you accidentally made
                multiple payments for the same registration, the duplicate
                amount(s) will be refunded.
              </li>
              <li>
                <strong>Technical Error:</strong> If your payment was deducted
                but registration was not confirmed due to a technical error, a
                full refund will be processed after verification.
              </li>
              <li>
                <strong>Medical Emergency:</strong> If you are unable to
                participate due to a medical emergency (subject to valid medical
                certificate submission), a refund may be considered at our
                discretion, minus processing fees.
              </li>
              <li>
                <strong>Early Withdrawal:</strong> If you withdraw your
                registration more than 30 days before the tournament start date,
                you may receive a partial refund of 70% of the registration fee.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. Non-Refundable Situations
            </h2>
            <p className="mb-4">
              Refunds will NOT be issued in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Change of mind or voluntary withdrawal within 30 days of the
                tournament start date
              </li>
              <li>
                Failure to participate without prior notice or valid reason
              </li>
              <li>Disqualification due to violation of tournament rules</li>
              <li>Inability to attend due to personal reasons (non-medical)</li>
              <li>
                Partial tournament participation (if the tournament has
                commenced)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              4. Refund Request Process
            </h2>
            <p className="mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>
                Email your refund request to{" "}
                <strong>support@wallearena.com</strong> with the subject line
                &quot;Refund Request - [Your Name] - [Player ID]&quot;
              </li>
              <li>
                Include the following information:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Full name as registered</li>
                  <li>Player ID or Registration ID</li>
                  <li>Razorpay Payment ID</li>
                  <li>Reason for refund request</li>
                  <li>
                    Supporting documents (if applicable - medical certificate,
                    payment screenshot, etc.)
                  </li>
                </ul>
              </li>
              <li>
                Our team will acknowledge your request within 48 hours of
                receipt
              </li>
              <li>
                We will review your request and communicate our decision within
                7-10 business days
              </li>
            </ol>
            <p className="mb-4">
              All refund requests must be submitted at least 15 days before the
              tournament start date to be considered, except in cases of
              tournament cancellation or technical errors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              5. Source Refund Policy
            </h2>
            <p className="mb-4">
              In compliance with Razorpay&apos;s guidelines and to prevent fraud
              and money laundering, all approved refunds will be processed back
              to the <strong>original payment method</strong> used during
              registration. We do not issue refunds to alternative bank accounts
              or payment methods.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Credit Card / Debit Card:</strong> Refund will be
                credited to the same card
              </li>
              <li>
                <strong>UPI:</strong> Refund will be credited to the UPI ID used
                for payment
              </li>
              <li>
                <strong>Net Banking:</strong> Refund will be credited to the
                bank account used for payment
              </li>
              <li>
                <strong>Wallets (Paytm, PhonePe, etc.):</strong> Refund will be
                credited to the same wallet
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Refund Processing Timeline
            </h2>
            <p className="mb-4">
              Once your refund request is approved, the processing timeline is
              as follows:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Initiation:</strong> We will initiate the refund within
                3-5 business days of approval
              </li>
              <li>
                <strong>Processing:</strong> The refund will be processed
                through Razorpay within 24-48 hours of initiation
              </li>
              <li>
                <strong>Bank Processing:</strong> After processing, it may take
                an additional <strong>5-10 business days</strong> for the amount
                to reflect in your bank account or payment method, depending on
                your bank&apos;s processing time
              </li>
            </ul>
            <p className="mb-4">
              <strong>Total Expected Timeline:</strong> 7-15 business days from
              approval to credit in your account
            </p>
            <p className="mb-4 text-sm text-gray-600">
              Note: The timeline may vary based on your bank&apos;s processing
              schedule. If you do not receive your refund within 15 business
              days, please contact us with your payment details for
              investigation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              7. Partial Refunds and Deductions
            </h2>
            <p className="mb-4">
              In certain cases, partial refunds may be issued with the following
              deductions:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Processing Fees:</strong> Payment gateway charges (2-3%
                of transaction amount) may be deducted for early withdrawals
              </li>
              <li>
                <strong>Administrative Charges:</strong> A flat fee of ₹500 may
                be deducted for refunds processed after team allocations have
                been made
              </li>
              <li>
                <strong>Late Withdrawal:</strong> Withdrawals within 30 days of
                the tournament will result in only 30% refund (70% retention as
                cancellation charges)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              8. Failed or Pending Payments
            </h2>
            <p className="mb-4">
              If your payment failed or is stuck in &quot;pending&quot; status:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                Check your bank account or payment method to confirm if the
                amount was deducted
              </li>
              <li>
                Wait for 24 hours as some payments take time to process or
                auto-reverse
              </li>
              <li>
                If the amount was deducted but registration status shows
                &quot;unpaid&quot;, contact us immediately at{" "}
                <strong>support@wallearena.com</strong> with:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Razorpay Payment ID or Transaction ID</li>
                  <li>Payment screenshot showing deduction</li>
                  <li>Your registered email and player ID</li>
                </ul>
              </li>
              <li>
                We will verify with Razorpay and either confirm your
                registration or initiate a refund within 3-5 business days
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              9. Razorpay Payment Processing
            </h2>
            <p className="mb-4">
              All payments are processed securely through Razorpay, a PCI-DSS
              Level 1 compliant payment gateway. Walle Arena does not store your
              credit card, debit card, or net banking credentials. All payment
              transactions are subject to Razorpay&apos;s Terms and Conditions
              and Privacy Policy.
            </p>
            <p className="mb-4">
              For payment-related queries or disputes with Razorpay, you may
              also contact Razorpay support at:{" "}
              <a
                href="https://razorpay.com/support/"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://razorpay.com/support/
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              10. Dispute Resolution
            </h2>
            <p className="mb-4">
              If you are not satisfied with our refund decision, you may
              escalate the matter by contacting our Grievance Officer (details
              provided in our Privacy Policy). We aim to resolve all disputes
              within 30 days of escalation.
            </p>
            <p className="mb-4">
              As a consumer, you also have the right to approach consumer forums
              under the Consumer Protection Act, 2019 for resolution of
              disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              11. Changes to This Policy
            </h2>
            <p className="mb-4">
              We reserve the right to modify this Refund and Return Policy at
              any time. Changes will be effective immediately upon posting on
              our website. Your continued use of our services after any changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              For any questions regarding this Refund and Return Policy or to
              request a refund, please contact us:
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
              <p>Phone: +91 9833208066</p>
              <p>
                Website:{" "}
                <a
                  href="https://www.wallearena.com"
                  className="text-blue-600 hover:underline"
                >
                  www.wallearena.com
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Customer Support Hours: Monday to Friday, 10:00 AM - 6:00 PM IST
              </p>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              We aim to respond to all refund requests within 48 hours and
              resolve them within 30 days as per regulatory requirements.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
