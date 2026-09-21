<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-24">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-[var(--royal-blue)] via-[var(--medium-blue)] to-[var(--royal-blue)] text-white">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        <p class="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-white/80 mb-3">
          Legal
        </p>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          Lodgenext Terms and Conditions
        </h1>
        <p class="text-sm sm:text-base text-white/90 max-w-3xl mx-auto leading-relaxed">
          By creating an account, accessing Lodgenext, listing a property, requesting an inspection,
          making a payment, or using any Lodgenext service, you agree to these Terms and Conditions.
          Please read them carefully before using the platform.
        </p>
        <p class="mt-4 text-xs sm:text-sm text-white/70">
          Last Updated: September 2026
        </p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <!-- Mobile TOC -->
        <div class="lg:hidden">
          <button
            type="button"
            @click="mobileTocOpen = !mobileTocOpen"
            class="w-full flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm"
          >
            <span class="font-semibold text-[var(--royal-blue)] text-sm">Table of Contents</span>
            <span class="text-[var(--steel-blue)]">{{ mobileTocOpen ? '−' : '+' }}</span>
          </button>
          <div
            v-if="mobileTocOpen"
            class="mt-2 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm max-h-72 overflow-y-auto"
          >
            <a
              v-for="item in toc"
              :key="item.id"
              :href="`#${item.id}`"
              @click="mobileTocOpen = false"
              class="block py-2 text-sm text-[var(--steel-blue)] hover:text-[var(--royal-blue)]"
            >
              {{ item.label }}
            </a>
          </div>
        </div>

        <!-- Desktop sticky TOC -->
        <aside class="hidden lg:block lg:col-span-3">
          <div class="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--medium-blue)] mb-3">
              Contents
            </p>
            <nav class="space-y-1">
              <a
                v-for="item in toc"
                :key="item.id"
                :href="`#${item.id}`"
                class="block text-sm py-1.5 text-[var(--steel-blue)] hover:text-[var(--royal-blue)] hover:pl-1 transition-all"
              >
                {{ item.label }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- Main content -->
        <main class="lg:col-span-9 space-y-6 sm:space-y-8">
          <!-- Intro card -->
          <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 reveal">
            <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
              These Terms and Conditions (“Terms”) govern your use of the Lodgenext platform and services.
              Lodgenext currently focuses on supported communities in
              <strong class="text-[var(--royal-blue)]">Kwara State</strong> and
              <strong class="text-[var(--royal-blue)]">Ogun State</strong>, Nigeria.
              If you do not agree with these Terms, you should not use Lodgenext.
            </p>
          </section>

          <!-- Sections -->
          <section
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="scroll-mt-24 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 reveal"
          >
            <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-[var(--royal-blue)] mb-4">
              {{ section.title }}
            </h2>

            <p
              v-if="section.intro"
              class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed mb-4"
            >
              {{ section.intro }}
            </p>

            <!-- Highlight callout -->
            <div
              v-if="section.highlight"
              class="mb-4 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed"
              :class="section.highlight.tone === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : section.highlight.tone === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-[var(--light-blue)] border-[var(--royal-blue)]/15 text-[var(--royal-blue)]'"
            >
              <p class="font-semibold mb-1">{{ section.highlight.title }}</p>
              <p>{{ section.highlight.text }}</p>
            </div>

            <ul
              v-if="section.list"
              class="list-disc pl-5 space-y-2 text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed"
            >
              <li v-for="(item, i) in section.list" :key="i">{{ item }}</li>
            </ul>

            <div v-if="section.blocks" class="space-y-4 mt-2">
              <div v-for="(block, bi) in section.blocks" :key="bi">
                <h3
                  v-if="block.subtitle"
                  class="text-sm sm:text-base font-semibold text-[var(--royal-blue)] mb-2"
                >
                  {{ block.subtitle }}
                </h3>

                <p
                  v-if="block.text"
                  class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed"
                >
                  {{ block.text }}
                </p>

                <ul
                  v-if="block.list"
                  class="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed mt-2"
                >
                  <li v-for="(item, li) in block.list" :key="li">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>

            <p
              v-if="section.outro"
              class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed mt-4"
            >
              {{ section.outro }}
            </p>
          </section>

          <!-- Contact -->
          <section
            id="contact"
            class="scroll-mt-24 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--medium-blue)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white reveal"
          >
            <h2 class="text-xl sm:text-2xl font-bold mb-3">27. Contact and Support</h2>
            <p class="text-sm sm:text-base text-white/90 leading-relaxed mb-5">
              Contact Lodgenext about these Terms, payment issues, inspection disputes, fraud reports,
              unsafe properties, account issues, complaints, or general support.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <a
                href="/support"
                class="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white text-[var(--royal-blue)] font-semibold text-sm hover:bg-[var(--light-blue)] transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@lodgenext.com"
                class="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                support@lodgenext.com
              </a>
            </div>
          </section>

          <!-- Acknowledgement -->
          <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 reveal">
            <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed mb-5">
              <strong class="text-[var(--royal-blue)]">By using Lodgenext</strong>, creating an account,
              listing a property, requesting an inspection, making a payment, or using any Lodgenext
              service, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
            </p>

            <p class="text-xs sm:text-sm text-[var(--steel-blue)] mb-5">
              Last Updated: September 2026
            </p>

            <label class="flex items-start gap-3 cursor-pointer mb-6">
              <input
                v-model="agreed"
                type="checkbox"
                class="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--royal-blue)] focus:ring-[var(--royal-blue)]"
              />
              <span class="text-sm text-[var(--steel-blue)]">
                I have read and agree to the Lodgenext Terms and Conditions
              </span>
            </label>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                :disabled="!agreed"
                @click="acceptTerms"
                class="px-6 py-3.5 rounded-2xl bg-[var(--royal-blue)] text-white font-semibold text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Accept &amp; Continue
              </button>
              <button
                type="button"
                @click="goBack"
                class="px-6 py-3.5 rounded-2xl border border-gray-200 text-[var(--steel-blue)] font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const agreed = ref(false)
const mobileTocOpen = ref(false)

type ContentBlock = {
  subtitle?: string
  text?: string
  list?: string[]
}

type Highlight = {
  tone: 'info' | 'warning' | 'danger'
  title: string
  text: string
}

type Section = {
  id: string
  title: string
  intro?: string
  outro?: string
  list?: string[]
  highlight?: Highlight
  blocks?: ContentBlock[]
}

type TocItem = {
  id: string
  label: string
}

const toc: TocItem[] = [
  { id: 'about', label: '1. About Lodgenext' },
  { id: 'eligibility', label: '2. Eligibility and Accounts' },
  { id: 'agents', label: '3. Agent Responsibilities' },
  { id: 'safety', label: '4. Property Safety' },
  { id: 'accuracy', label: '5. Property Information' },
  { id: 'inspections', label: '6. Inspection Services' },
  { id: 'fees', label: '7. Inspection Fees' },
  { id: 'payroll', label: '8. Agent Inspection Payments' },
  { id: 'noshow', label: '9. No-Show Policy' },
  { id: 'payments', label: '10. Payments' },
  { id: 'bypass', label: '11. No Bypassing Lodgenext' },
  { id: 'customers', label: '12. Customer Responsibilities' },
  { id: 'fraud', label: '13. Fraud and Prohibited Activities' },
  { id: 'reports', label: '14. Inspection Reports' },
  { id: 'transactions', label: '15. Property Transactions' },
  { id: 'refunds', label: '16. Refunds and Cancellations' },
  { id: 'complaints', label: '17. Complaints and Disputes' },
  { id: 'conduct', label: '18. User Conduct' },
  { id: 'availability', label: '19. Platform Availability' },
  { id: 'thirdparty', label: '20. Third-Party Services' },
  { id: 'privacy', label: '21. Privacy' },
  { id: 'ip', label: '22. Intellectual Property' },
  { id: 'suspension', label: '23. Suspension and Termination' },
  { id: 'limitation', label: '24. Limitation of Responsibility' },
  { id: 'changes', label: '25. Changes to These Terms' },
  { id: 'law', label: '26. Governing Law' },
  { id: 'contact', label: '27. Contact and Support' },
]

const sections: Section[] = [
  {
    id: 'about',
    title: '1. About Lodgenext',
    intro:
      'Lodgenext is a property platform designed to help customers discover properties, connect with property agents, request property inspections, and facilitate property-related transactions through the platform.',
    outro:
      'Lodgenext provides the platform and processes that facilitate connections and transactions. Lodgenext does not automatically become the owner, landlord, seller, or physical manager of every property listed on the platform.',
  },
  {
    id: 'eligibility',
    title: '2. Eligibility and User Accounts',
    intro: 'To use Lodgenext, you must create and maintain an account responsibly.',
    list: [
      'You must provide accurate information when creating an account.',
      'You must not create accounts using false identities or misleading information.',
      'You are responsible for keeping your account details confidential.',
      'You must notify Lodgenext if you believe your account has been compromised.',
      'You must not use another person’s account without permission.',
      'Lodgenext may suspend or terminate accounts involved in fraudulent, abusive, illegal, or suspicious activities.',
    ],
  },
  {
    id: 'agents',
    title: '3. Agent Registration and Responsibilities',
    intro: 'Every agent using Lodgenext is expected to:',
    list: [
      'Provide accurate personal and professional information.',
      'Provide accurate property information.',
      'Only list properties they are authorised to market, represent, manage, rent, sell, or otherwise offer.',
      'Provide genuine photographs, videos, descriptions, prices, locations, amenities, and property conditions.',
      'Keep listed properties available and accurately updated.',
      'Respond professionally to customers.',
      'Honour confirmed inspection arrangements.',
      'Maintain professional and respectful communication with customers.',
      'Comply with applicable Nigerian laws and regulations.',
      'Cooperate with Lodgenext’s verification and administrative processes.',
    ],
    outro:
      'Agents must not knowingly provide false, misleading, incomplete, or fraudulent property information.',
  },
  {
    id: 'safety',
    title: '4. Property Safety and Listing Requirements',
    highlight: {
      tone: 'warning',
      title: 'Property Safety Standard',
      text: 'Any property listed on Lodgenext must be reasonably safe, accessible, legitimate, and suitable for the purpose for which it is being advertised.',
    },
    intro: 'Agents must not knowingly list:',
    list: [
      'Unsafe properties.',
      'Abandoned or inaccessible properties without proper disclosure.',
      'Properties they have no authority to market.',
      'Fake properties.',
      'Properties using stolen photographs or misleading information.',
      'Properties with intentionally false prices or descriptions.',
      'Properties that present undisclosed serious safety risks.',
      'Properties involved in illegal activities.',
    ],
    outro:
      'Lodgenext may review, reject, suspend, remove, or investigate a listing where there are concerns about authenticity, safety, accuracy, legality, or compliance. Property review or approval by Lodgenext does not replace the customer’s responsibility to inspect the property and make appropriate decisions before entering into a transaction.',
  },
  {
    id: 'accuracy',
    title: '5. Property Information and Accuracy',
    intro: 'Agents are responsible for ensuring that:',
    list: [
      'Property prices are accurate.',
      'Property location is accurate.',
      'Property type is correctly stated.',
      'Number of bedrooms, bathrooms, toilets, and parking spaces are accurate.',
      'Amenities are accurately represented.',
      'Property condition is honestly represented.',
      'Availability is updated.',
      'Inspection information is accurate.',
    ],
    outro:
      'Where a material change occurs, the agent should update the listing promptly. Lodgenext may take down or restrict listings that contain inaccurate or misleading information.',
  },
  {
    id: 'inspections',
    title: '6. Inspection Services',
    intro: 'Customers may request property inspections through Lodgenext.',
    list: [
      'Inspection requests must be submitted through the Lodgenext platform.',
      'Customers must provide accurate information when requesting an inspection.',
      'Customers are expected to attend scheduled inspections.',
      'Agents are expected to honour confirmed inspection appointments.',
      'Agents must communicate with customers regarding legitimate changes to inspection arrangements.',
      'Inspection dates and times may be subject to confirmation.',
      'Customers should not assume an inspection is confirmed until the platform or an authorised agent confirms it.',
    ],
  },
  {
    id: 'fees',
    title: '7. Inspection Fees',
    highlight: {
      tone: 'warning',
      title: 'No Unofficial Inspection Charges',
      text: 'Agents must not arbitrarily increase, inflate, or overcharge customers for inspection. An agent must not demand an additional unofficial inspection fee outside the approved Lodgenext process.',
    },
    list: [
      'Inspection fees are displayed or communicated through the Lodgenext platform.',
      'Customers should pay inspection fees through the approved payment method available on Lodgenext.',
      'Any attempt by an agent to demand an unauthorised inspection charge should be reported to Lodgenext.',
      'Inspection fees may vary depending on property type, location, or the applicable Lodgenext pricing structure.',
      'Lodgenext may review reported inspection-fee disputes and take appropriate action.',
    ],
  },
  {
    id: 'payroll',
    title: '8. Inspection Agent Payment / Agent Payroll',
    intro:
      'Legitimate inspection fees collected through Lodgenext may form part of the agent’s payable earnings.',
    list: [
      'Inspection payments are recorded through the Lodgenext platform.',
      'Eligible inspection fees may be credited to the assigned agent’s payable balance after the inspection has been successfully completed and applicable requirements have been satisfied.',
      'Agent payments may be subject to verification, dispute review, fraud checks, cancellation status, and other platform requirements.',
      'Lodgenext may temporarily withhold payment where an inspection, transaction, complaint, or account activity is under investigation.',
      'Agents must not attempt to collect inspection payments outside the approved Lodgenext payment process.',
    ],
  },
  {
    id: 'noshow',
    title: '9. Customer Attendance and Inspection No-Show Policy',
    intro:
      'Customers are expected to attend a confirmed inspection appointment. If a customer requests an inspection but fails to attend:',
    list: [
      'The customer should communicate with the agent or Lodgenext as soon as possible.',
      'If the customer does not attend and does not provide appropriate communication, the inspection fee may become non-refundable.',
      'Where the customer fails to attend the inspection and there is no call or meaningful communication from the customer, the inspection payment will not be refundable after the applicable five (5) working-day period.',
      'Lodgenext may review exceptional circumstances on a case-by-case basis.',
      'If the agent fails to attend or fails to properly communicate with the customer, the customer may report the matter to Lodgenext for review.',
    ],
    outro: 'This policy is intended to be fair to both customers and agents.',
  },
  {
    id: 'payments',
    title: '10. Payments',
    highlight: {
      tone: 'info',
      title: 'Authorised Payments Only',
      text: 'All payments relating to Lodgenext services must be made through the payment methods provided or authorised within the Lodgenext application/platform.',
    },
    intro: 'Users must not:',
    list: [
      'Send payment to an agent’s personal bank account when the transaction is required to be completed through Lodgenext.',
      'Pay through unauthorised third-party channels.',
      'Use fake payment screenshots or fraudulent payment confirmations.',
      'Claim to have paid when payment has not been successfully confirmed.',
      'Ask another user to bypass the Lodgenext payment system.',
    ],
    outro:
      'Where a payment is required through Lodgenext, users should rely on the payment status displayed or confirmed by the platform.',
  },
  {
    id: 'bypass',
    title: '11. No Bypassing of Lodgenext',
    highlight: {
      tone: 'danger',
      title: 'Platform Bypass is Prohibited',
      text: 'Once Lodgenext connects an agent and customer through the platform, both parties are prohibited from deliberately bypassing Lodgenext in order to avoid applicable platform fees, inspection processes, payment processes, transaction records, safety measures, or other platform requirements.',
    },
    intro: 'Examples include:',
    list: [
      'An agent asking a customer to pay directly outside Lodgenext.',
      'A customer deliberately paying an agent outside Lodgenext after being connected through the platform.',
      'An agent and customer deliberately moving a transaction outside Lodgenext to avoid applicable charges.',
      'Sharing personal payment details for the purpose of avoiding the platform’s payment system.',
      'Completing a transaction privately after using Lodgenext’s services to establish the connection where doing so is intended to circumvent the platform.',
    ],
    outro:
      'Communication outside the platform may sometimes be necessary for legitimate purposes, such as coordinating an inspection. Users must not use external communication to deliberately circumvent Lodgenext’s payment, transaction, safety, or administrative processes. Lodgenext may suspend or terminate accounts involved in deliberate platform bypassing.',
  },
  {
    id: 'customers',
    title: '12. Customer Responsibilities',
    intro: 'Customers must:',
    list: [
      'Provide accurate account information.',
      'Provide accurate inspection information.',
      'Attend confirmed inspections.',
      'Treat agents and other users respectfully.',
      'Make payments through authorised Lodgenext payment methods.',
      'Verify property information before entering into a final agreement.',
      'Report suspicious listings, payment requests, fraud, or unsafe properties.',
      'Not provide false payment evidence.',
      'Not deliberately bypass Lodgenext.',
    ],
    outro:
      'Customers should conduct appropriate due diligence before signing agreements, paying property-related sums, or taking possession of a property.',
  },
  {
    id: 'fraud',
    title: '13. Fraud, Scams and Prohibited Activities',
    highlight: {
      tone: 'danger',
      title: 'Zero Tolerance for Fraud',
      text: 'Lodgenext has zero tolerance for fraudulent, deceptive, or intentionally dishonest activities on the platform. Any form of fraud, attempted fraud, financial deception, impersonation, or deliberate abuse will be investigated and dealt with accordingly.',
    },
    intro: 'Prohibited conduct includes:',
    list: [
      'Fake property listings.',
      'Fake identities.',
      'Fake payment confirmations.',
      'False inspection records.',
      'Misrepresentation of property ownership or authority.',
      'Stolen property photographs or content.',
      'Fraudulent payment requests.',
      'Identity impersonation.',
      'Creating multiple accounts to deceive users or manipulate the platform.',
      'Manipulating reviews, reports, property views, or other platform information.',
      'Attempting to steal another user’s account.',
      'Deliberately bypassing Lodgenext to commit fraud or avoid platform processes.',
      'Any other activity intended to deceive, defraud, exploit, or cause financial harm to another user.',
    ],
    blocks: [
      {
        subtitle: 'Possible actions by Lodgenext',
        list: [
          'Suspend or terminate the account.',
          'Remove property listings.',
          'Withhold pending platform payments while an investigation is conducted.',
          'Restrict access to the platform.',
          'Reverse or investigate transactions where possible.',
          'Report suspected criminal activity to appropriate authorities where required or appropriate.',
          'Cooperate with lawful investigations.',
        ],
      },
    ],
  },
  {
    id: 'reports',
    title: '14. Property Inspection and Reports',
    intro:
      'Inspection information, photographs, videos, observations, reports, and acknowledgements may be recorded through Lodgenext.',
    list: [
      'An inspection report reflects observations made during the inspection.',
      'An inspection does not guarantee the absence of hidden defects.',
      'Customers should conduct additional checks where necessary.',
      'Lodgenext and its agents should not be considered responsible for defects that could not reasonably be identified during an inspection.',
      'Customers should review available inspection information before making a final property decision.',
    ],
  },
  {
    id: 'transactions',
    title: '15. Property Transactions',
    list: [
      'Users remain responsible for reviewing the terms of any tenancy, rental, sale, lease, or other property agreement they enter into.',
      'Customers and agents should ensure that relevant agreements are properly documented.',
      'Lodgenext does not guarantee that every property transaction will proceed successfully.',
      'Where applicable, Lodgenext may provide platform records, payment records, inspection records, or communication records relating to the transaction.',
    ],
  },
  {
    id: 'refunds',
    title: '16. Refunds and Cancellations',
    intro: 'Refunds may depend on:',
    list: [
      'The type of payment.',
      'Whether the service has already been provided.',
      'Whether an inspection has taken place.',
      'Whether the customer or agent cancelled.',
      'Whether there was a verified failure by the agent.',
      'Whether fraud or a dispute is under investigation.',
      'The specific refund terms displayed at the time of payment.',
    ],
    outro:
      'Not every payment is automatically refundable. The inspection no-show rules in Section 9 also apply.',
  },
  {
    id: 'complaints',
    title: '17. Complaints and Dispute Reporting',
    intro: 'Customers and agents may report:',
    list: [
      'Fraud.',
      'Unsafe properties.',
      'Overcharging.',
      'Failed inspections.',
      'Unauthorised payment requests.',
      'Misleading listings.',
      'Harassment or abusive behaviour.',
      'Payment disputes.',
      'Attempts to bypass Lodgenext.',
    ],
    blocks: [
      {
        subtitle: 'Evidence Lodgenext may request',
        list: [
          'Screenshots.',
          'Payment receipts.',
          'Messages.',
          'Property photographs.',
          'Inspection records.',
          'Relevant transaction information.',
        ],
      },
    ],
    outro: 'Lodgenext will review complaints based on the information available.',
  },
  {
    id: 'conduct',
    title: '18. User Conduct',
    intro: 'Users must not use Lodgenext to:',
    list: [
      'Harass or threaten another user.',
      'Discriminate unlawfully.',
      'Publish abusive or offensive content.',
      'Conduct illegal activities.',
      'Upload malicious files or content.',
      'Attempt to interfere with the platform.',
      'Access another user’s account without authorisation.',
      'Manipulate platform data.',
      'Abuse platform features.',
    ],
  },
  {
    id: 'availability',
    title: '19. Platform Availability',
    intro:
      'Lodgenext aims to maintain a reliable service but cannot guarantee that the platform will always be available without interruptions.',
    outro:
      'Maintenance, technical problems, internet failures, third-party services, payment-provider issues, security incidents, or circumstances outside Lodgenext’s reasonable control may temporarily affect availability.',
  },
  {
    id: 'thirdparty',
    title: '20. Third-Party Services and Payments',
    intro:
      'Lodgenext may use third-party services such as payment processors, hosting providers, communication services, maps, storage services, or other technology providers.',
    outro:
      'Where applicable, users may also be subject to the terms and policies of those third-party services.',
  },
  {
    id: 'privacy',
    title: '21. Privacy and Personal Information',
    intro:
      'Lodgenext may collect and process information necessary to provide its services, including account information, property information, inspection information, transaction information, and platform activity.',
    outro:
      'Please review the Lodgenext Privacy Policy for more information about how personal information is collected, used, stored, and protected.',
  },
  {
    id: 'ip',
    title: '22. Intellectual Property',
    list: [
      'Lodgenext’s platform, branding, logos, designs, software, text, graphics, interface, and other original platform content belong to Lodgenext or its relevant licensors unless otherwise stated.',
      'Users must not copy, reproduce, modify, distribute, sell, or commercially exploit Lodgenext’s protected content without appropriate permission.',
      'Agents retain ownership or authorised rights to content they upload, but grant Lodgenext the necessary permission to display and use that content for operating and promoting the platform.',
    ],
  },
  {
    id: 'suspension',
    title: '23. Account Suspension and Termination',
    intro:
      'Lodgenext may suspend, restrict, or terminate an account where there is evidence or reasonable concern involving:',
    list: [
      'Fraud.',
      'Misrepresentation.',
      'Unsafe property listings.',
      'Unauthorised payment requests.',
      'Platform bypassing.',
      'Abuse or harassment.',
      'Repeated violation of these Terms.',
      'Illegal activity.',
      'Security risks.',
      'Other conduct that may harm users or the platform.',
    ],
    outro:
      'Where appropriate, Lodgenext may provide an explanation or allow an appeal or review.',
  },
  {
    id: 'limitation',
    title: '24. Limitation of Responsibility',
    intro:
      'Lodgenext provides a technology platform that facilitates connections and services between users.',
    blocks: [
      {
        subtitle: 'Lodgenext does not guarantee',
        list: [
          'The ownership of every listed property.',
          'The financial ability of every user.',
          'The absence of hidden property defects.',
          'The outcome of every property transaction.',
          'The behaviour of every independent agent or customer.',
        ],
      },
    ],
    outro:
      'However, Lodgenext may take reasonable platform-level measures including verification, reporting, inspection processes, payment records, account restrictions, and investigation of reported misconduct.',
  },
  {
    id: 'changes',
    title: '25. Changes to These Terms',
    intro:
      'Lodgenext may update these Terms and Conditions from time to time. Users should review the latest version before continuing to use the platform.',
    outro:
      'Where appropriate, significant changes may be communicated through the application or other available communication channels.',
  },
  {
    id: 'law',
    title: '26. Governing Law',
    intro:
      'These Terms should be interpreted in accordance with the applicable laws of the Federal Republic of Nigeria, subject to any mandatory legal requirements applicable to the parties.',
    outro:
      'These Terms are provided for platform use and may be reviewed and updated by Lodgenext as needed.',
  },
]

const acceptTerms = () => {
  if (!agreed.value) return
  try {
    localStorage.setItem('lodgenext_terms_accepted', 'true')
    localStorage.setItem('lodgenext_terms_accepted_at', new Date().toISOString())
  } catch (_) {
    // ignore storage errors
  }
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08 }
  )

  document.querySelectorAll('.reveal').forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>