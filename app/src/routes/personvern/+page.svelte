<script>
  import { _ } from "$lib/i18n";
</script>

<svelte:head>
  <title>{$_('common.privacyPolicy')} | Capra Liflig Fryde</title>
</svelte:head>

<section class="text-lg font-light sm:w-[80%]">
  <h1 class="pb-4 pt-8 text-5xl font-light">{$_('common.privacyPolicy')}</h1>

  <p class="py-4">
    {$_('privacy.intro')}
  </p>

  <p class="py-4">
    {$_('privacy.responsibility')}
  </p>

  <h2 class="pt-8 text-3xl">{$_('privacy.nonEmployeeTitle')}</h2>
  <p class="py-4">
    {$_('privacy.nonEmployeeText')}
  </p>

  <h2 class="pt-8 text-3xl">{$_('privacy.recruitmentTitle')}</h2>
  <p class="py-4">
    {$_('privacy.recruitmentText')}
  </p>

  <h3 class="pt-6 text-2xl">{$_('privacy.selfRegistrationTitle')}</h3>
  <ul class="list-inside list-disc space-y-2 py-4 ps-5">
    {#each $_('privacy.selfRegistrationList') as item}
      <li>{item}</li>
    {/each}
  </ul>

  <h3 class="pt-6 text-2xl">
    {$_('privacy.tippedCandidateTitle')}
  </h3>
  <ul class="list-inside list-disc space-y-2 py-4 ps-5">
    {#each $_('privacy.tippedCandidateList') as item}
      <li>{item}</li>
    {/each}
  </ul>

  <h2 class="pt-8 text-3xl">{$_('privacy.salesTitle')}</h2>
  <p class="py-4">
    {$_('privacy.salesText')}
  </p>

  <h3 class="pt-6 text-2xl">{$_('privacy.customerInfoTitle')}</h3>
  <ul class="list-inside list-disc space-y-2 py-4 ps-5">
    {#each $_('privacy.customerInfoList') as item}
      <li>{item}</li>
    {/each}
  </ul>

  <h3 class="pt-6 text-2xl">{$_('privacy.subcontractorSelfRegTitle')}</h3>
  <ul class="list-inside list-disc space-y-2 py-4 ps-5">
    {#each $_('privacy.subcontractorSelfRegList') as item}
      <li>{item}</li>
    {/each}
  </ul>

  <h3 class="pt-6 text-2xl">
    {$_('privacy.tippedSubcontractorTitle')}
  </h3>
  <ul class="list-inside list-disc space-y-2 py-4 ps-5">
    {#each $_('privacy.tippedSubcontractorList') as item}
      <li>{item}</li>
    {/each}
  </ul>

  <h2 class="pt-8 text-3xl">{$_('privacy.employeeDataTitle')}</h2>
  <p class="py-4">
    {$_('privacy.employeeDataText1')}
  </p>
  <p class="py-4">
    {$_('privacy.employeeDataText2')}
  </p>
  <p class="py-4">
    {$_('privacy.employeeDataText3')}
  </p>
  <ul class="list-inside list-disc space-y-2 py-4 ps-5">
    {#each $_('privacy.employeeDataList') as item}
      <li>{item}</li>
    {/each}
  </ul>

  <h2 class="pt-8 text-3xl">{$_('privacy.securityTitle')}</h2>
  <p class="py-4">
    {$_('privacy.securityText')}
  </p>

  <h2 class="pt-8 text-3xl">{$_('privacy.rightsTitle')}</h2>
  <p class="py-4">
    {$_('privacy.rightsText')}
  </p>

  <h2 class="pt-8 text-3xl">{$_('privacy.contactTitle')}</h2>
  <p class="py-4">
    {$_('privacy.contactText')} <br /><br />

    {#each $_('privacy.contactInfo').split('\n') as line}
      {line} <br />
    {/each}
    <br />

    <a href="mailto:{$_('privacy.contactEmail')}" class="font-normal underline"
      >{$_('privacy.contactEmail')}</a
    >
  </p>
</section>
