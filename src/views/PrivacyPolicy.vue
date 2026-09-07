<template>
     <Navbar/>
  <div class="min-h-screen bg-[var(--light-blue)] pb-16">
   
    <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
      <!-- Header -->
      <div class="mb-8 sm:mb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">
          Privacy Policy
        </h1>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] mt-2">
          Version 1.0 | September 2026
        </p>
      </div>

      <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 md:p-10 space-y-8 sm:space-y-10">
        <!-- Intro -->
        <section class="space-y-4 text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
          <p>
            At LodgeNext (“LodgeNext”, “we”, “us”, or “our”), the privacy of our customers, agents,
            users of our services, and their Personal Data is of utmost importance. This Privacy
            Policy explains how we collect, use, process, store, share, and protect your Personal
            Data when you visit our website, use our mobile or web platforms, or interact with our
            services (collectively, the “Platform” or “Services”).
          </p>
          <p>
            This Privacy Policy forms part of our commitment to protecting your privacy and
            complying with the
            <strong class="text-[var(--royal-blue)]">Nigeria Data Protection Act 2023 (NDPA)</strong>
            and other applicable data protection laws and regulations in Nigeria.
          </p>
          <p>
            By accessing or using the LodgeNext Platform, you acknowledge that you have read and
            understood this Privacy Policy.
          </p>
        </section>

        <!-- Sections -->
        <section v-for="(section, index) in sections" :key="index" class="space-y-3 sm:space-y-4">
          <h2 class="text-lg sm:text-xl font-bold text-[var(--royal-blue)]">
            {{ section.title }}
          </h2>

          <p
            v-if="section.intro"
            class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed"
          >
            {{ section.intro }}
          </p>

          <ul
            v-if="section.list"
            class="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed"
          >
            <li v-for="(item, i) in section.list" :key="i">
              <span v-if="typeof item === 'string'">{{ item }}</span>
              <template v-else>
                <strong class="text-[var(--royal-blue)]">{{ item.label }}</strong>
                {{ item.text }}
              </template>
            </li>
          </ul>

          <div v-if="section.blocks" class="space-y-4">
            <div v-for="(block, bi) in section.blocks" :key="bi" class="space-y-2">
              <h3
                v-if="block.subtitle"
                class="text-sm sm:text-base font-semibold text-[var(--royal-blue)]"
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
                class="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed"
              >
                <li v-for="(item, li) in block.list" :key="li">{{ item }}</li>
              </ul>
            </div>
          </div>

          <p
            v-if="section.outro"
            class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed"
          >
            {{ section.outro }}
          </p>
        </section>

        <!-- Contact -->
        <section class="space-y-3 sm:space-y-4 border-t border-gray-100 pt-6 sm:pt-8">
          <h2 class="text-lg sm:text-xl font-bold text-[var(--royal-blue)]">
            13. Contact Us
          </h2>
          <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
            If you have questions, requests, or concerns about this Privacy Policy or how we handle
            your Personal Data, please contact us:
          </p>
          <div class="bg-gray-50 rounded-2xl p-4 sm:p-5 space-y-2 text-sm sm:text-base">
            <p class="font-semibold text-[var(--royal-blue)]">Data Protection Contact – LodgeNext</p>
            <p class="text-[var(--steel-blue)]">
              Email:
              <a href="mailto:support@lodgenext.com" class="text-[var(--royal-blue)] hover:underline">
                support@lodgenext.com
              </a>
            </p>
            <p class="text-[var(--steel-blue)]">
              Phone:
              <a href="tel:+2349030031328" class="text-[var(--royal-blue)] hover:underline">
                +234 903 003 1328
              </a>
            </p>
            <p class="text-[var(--steel-blue)]">
              Support Hours: Monday – Saturday, 9:00 AM – 6:00 PM (WAT)
            </p>
          </div>
          <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
            You may also contact the
            <strong class="text-[var(--royal-blue)]">Nigeria Data Protection Commission (NDPC)</strong>
            if you are not satisfied with our response.
          </p>
        </section>

        <!-- Footer note -->
        <div class="border-t border-gray-100 pt-6 text-center">
          <p class="text-sm font-medium text-[var(--royal-blue)]">
            LodgeNext
          </p>
          <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-1">
            Protecting your privacy while connecting you to better property experiences.
          </p>
        </div>
      </div>
    </div>
   
  </div>
   <Footer/>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';

const sections = [
  {
    title: '1. Lawful Basis for Processing Your Data',
    intro:
      'Depending on our interactions with you, we process your Personal Data on one or more of the following lawful bases:',
    list: [
      'Performance of a contract we have entered into, or are about to enter into, with you',
      'Your consent',
      'Our legitimate business interests (or those of a third party), provided these interests do not override your fundamental rights and freedoms',
      'Compliance with legal or regulatory obligations',
    ],
  },
  {
    title: '2. Consent',
    intro: 'You give consent to the processing of your Personal Data when you:',
    list: [
      'Create an account or use our Platform',
      'Accept our cookie notice',
      'Submit information for agent verification, property listings, inspection requests, or support tickets',
      'Otherwise provide data for official or service-related purposes',
    ],
    outro:
      'You may withdraw your consent at any time. Withdrawal will not affect the lawfulness of processing carried out before the withdrawal.',
  },
  {
    title: '3. What Personal Data Do We Collect?',
    intro:
      'We collect Personal Data when you use our Services, including but not limited to:',
    blocks: [
      {
        subtitle: 'i. Account and Profile Information',
        text: 'Full name, email address, phone number, password, role (customer or agent), state, city, LGA, agency name, office address, avatar, and other profile details you provide.',
      },
      {
        subtitle: 'ii. Agent Verification Data',
        text: 'Date of birth, years of experience, business registration number, National Identity Number (NIN), areas of operation, and uploaded documents such as government-issued ID, passport photograph, proof of address, and related verification files.',
      },
      {
        subtitle: 'iii. Property and Transaction Information',
        text: 'Property details, listing information, prices, locations, inspection requests, preferred inspection dates/times, messages, payment references (where applicable), and related activity history.',
      },
      {
        subtitle: 'iv. Support and Communication Data',
        text: 'Support ticket subject, category, message, preferred location, and any follow-up correspondence with our team.',
      },
      {
        subtitle: 'v. Device and Technical Information',
        text: 'IP address, device type, browser type, operating system, usage logs, and approximate location data (where permitted) to improve security and Platform performance.',
      },
      {
        subtitle: 'vi. Information from Other Sources',
        text: 'We may receive information from third-party identity verification services, payment partners, or publicly available sources where permitted by law, solely for verification, fraud prevention, or service delivery.',
      },
    ],
    outro: 'We only collect data that is relevant and necessary for the purposes described in this Policy.',
  },
  {
    title: '4. Information of Minors',
    intro:
      'LodgeNext Services are intended for users who are 18 years of age or older. If you are under 18, you may only use the Platform under the supervision and with the consent of a parent or legal guardian, subject to applicable law. We do not knowingly collect Personal Data from children under 18 without such consent.',
  },
  {
    title: '5. How Do We Retain Personal Data?',
    intro: 'We retain Personal Data only for as long as necessary to:',
    list: [
      'Provide our Services to you',
      'Fulfil the purposes for which it was collected',
      'Meet legal, accounting, tax, or regulatory obligations',
      'Resolve disputes and enforce our agreements',
    ],
    outro:
      'When Personal Data is no longer required, we will securely delete or anonymise it, subject to any legal retention requirements.',
  },
  {
    title: '6. How Do We Process Personal Data?',
    intro:
      'We process your Personal Data to provide a secure and efficient experience, including to:',
    blocks: [
      {
        subtitle: 'i. Provide and improve our Services',
        list: [
          'Create and manage your account',
          'Process agent verification requests',
          'List and manage properties',
          'Handle inspection requests and related communications',
          'Provide customer and agent support',
        ],
      },
      {
        subtitle: 'ii. Manage risk, security, and fraud prevention',
        list: [
          'Verify identity',
          'Detect and prevent unauthorised access, abuse, or fraudulent activity',
        ],
      },
      {
        subtitle: 'iii. Comply with legal and regulatory obligations',
        text: 'Meet requirements under Nigerian law and directives from relevant authorities.',
      },
      {
        subtitle: 'iv. Communicate with you',
        text: 'Send service-related notifications, updates, and responses to support requests.',
      },
      {
        subtitle: 'v. With your consent',
        list: [
          'Send marketing or promotional communications about LodgeNext services',
          'Use certain cookies or similar technologies for improved experience',
        ],
      },
    ],
    outro: 'You may opt out of marketing communications at any time.',
  },
  {
    title: '7. Sharing Your Personal Data',
    intro: 'We may share your Personal Data in the following circumstances:',
    list: [
      {
        label: 'With service providers:',
        text: 'who perform services on our behalf (e.g., hosting, identity verification, payment processing, analytics, customer support tools), under appropriate confidentiality and security obligations.',
      },
      {
        label: 'With other users of the Platform:',
        text: 'as necessary to facilitate Services (e.g., sharing relevant agent or customer details for inspection coordination).',
      },
      {
        label: 'With law enforcement, regulators, or government authorities:',
        text: 'where required by law, court order, or to protect rights, safety, or property.',
      },
      {
        label: 'In connection with a business transfer:',
        text: '(merger, acquisition, or sale of assets), subject to appropriate safeguards.',
      },
      {
        label: 'With your consent:',
        text: 'or at your direction.',
      },
    ],
    outro:
      'We do not sell your Personal Data. Where Personal Data is transferred outside Nigeria, we implement appropriate safeguards consistent with the NDPA, such as standard contractual clauses or other lawful transfer mechanisms.',
  },
  {
    title: '8. How We Use Cookies',
    intro:
      'Cookies are small files placed on your device that help the Platform function and improve your experience. We may use session and similar cookies to:',
    list: [
      'Keep you logged in',
      'Remember preferences',
      'Analyse usage and improve performance',
      'Support security features',
    ],
    outro:
      'You can manage or disable cookies through your browser settings. Note that disabling certain cookies may limit some Platform functionality.',
  },
  {
    title: '9. What Are Your Rights?',
    intro:
      'Under the Nigeria Data Protection Act 2023, you have the following rights (subject to applicable limitations):',
    blocks: [
      {
        subtitle: 'i. Right of Access',
        text: 'Request confirmation of whether we hold Personal Data about you and obtain a copy.',
      },
      {
        subtitle: 'ii. Right to Rectification',
        text: 'Request correction of inaccurate or incomplete Personal Data.',
      },
      {
        subtitle: 'iii. Right to Erasure',
        text: 'Request deletion of your Personal Data in certain circumstances (e.g., where it is no longer necessary, or you withdraw consent and no other lawful basis applies).',
      },
      {
        subtitle: 'iv. Right to Object',
        text: 'Object to processing based on legitimate interests or for direct marketing.',
      },
      {
        subtitle: 'v. Right to Restrict Processing',
        text: 'Request restriction of processing in specific situations.',
      },
      {
        subtitle: 'vi. Right to Data Portability',
        text: 'Request your Personal Data in a structured, commonly used, machine-readable format, where technically feasible.',
      },
      {
        subtitle: 'vii. Right not to be subject solely to automated decision-making',
        text: 'Where applicable, object to decisions based solely on automated processing that significantly affect you.',
      },
      {
        subtitle: 'viii. Right to be Informed',
        text: 'Receive clear information about how we process your data (as provided in this Policy).',
      },
      {
        subtitle: 'ix. Right to Withdraw Consent',
        text: 'Withdraw consent at any time where processing is based on consent.',
      },
      {
        subtitle: 'x. Right to Lodge a Complaint',
        text: 'Lodge a complaint with the Nigeria Data Protection Commission (NDPC) or another competent authority.',
      },
    ],
    outro:
      'To exercise any of these rights, contact us using the details in Section 13. We will respond within the timeframes required by law.',
  },
  {
    title: '10. How Do We Protect Your Personal Data?',
    blocks: [
      {
        subtitle: 'i. Security',
        text: 'We implement technical, organisational, and administrative measures designed to protect Personal Data against loss, misuse, unauthorised access, disclosure, alteration, or destruction. These may include encryption, access controls, secure hosting, and regular security reviews.',
      },
      {
        subtitle: 'ii. Confidentiality',
        text: 'Personal Data is treated as confidential and is accessed only by authorised personnel who need it to perform their duties.',
      },
      {
        subtitle: 'iii. Your Responsibilities',
        text: 'You are responsible for keeping your login credentials secure and for ensuring that the information you provide to us is accurate and up to date. Please notify us promptly of any suspected unauthorised access to your account.',
      },
    ],
    outro:
      'In the event of a personal data breach likely to result in a high risk to your rights and freedoms, we will notify you and the relevant authority as required by law.',
  },
  {
    title: '11. Remedies for Violation and Timeframe',
    intro:
      'If you believe any of your data protection rights have been violated, please contact our Data Protection Officer. We aim to investigate and address valid concerns within 30 days of receiving notice (or such longer period as may be permitted under applicable law). Remedies may include correction or deletion of data, restriction of processing, provision of information, or other measures required by law.',
  },
  {
    title: '12. Changes to This Privacy Policy',
    intro:
      'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. The revised version will be effective as of the published update date. Material changes will be communicated through the Platform, email, or other appropriate channels. We encourage you to review this Policy periodically.',
  },
]
</script>