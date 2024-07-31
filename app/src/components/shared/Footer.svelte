<script>
  import capraLogoWhite from "$lib/assets/capra-white-vertical.webp";
  import capraLogoBlack from "$lib/assets/capra-black-vertical.webp";
  import frydeLogoWhite from "$lib/assets/fryde-white-vertical.webp";
  import frydeLogoBlack from "$lib/assets/fryde-black-vertical.webp";
  import lifligLogoWhite from "$lib/assets/liflig-white-vertical.webp";
  import lifligLogoBlack from "$lib/assets/liflig-black-vertical.webp";
  import miljofyrtarnDark from "$lib/assets/miljofyrtarn-dark.webp";
  import miljofyrtarnLight from "$lib/assets/miljofyrtarn-light.webp";
  import dnvDark from "$lib/assets/dnv-dark.webp";
  import dnvLight from "$lib/assets/dnv-light.webp";
</script>

<footer
  class="gap-8py-16 flex h-[470px] w-full flex-col items-center justify-center text-lg font-light sm:gap-12"
>
  <p class="pb-2 pt-6">Vi er en del av Capra-gruppen</p>
  <div class="flex w-full flex-col items-center justify-evenly gap-6 sm:flex-row sm:gap-0">
    <div class="flex flex-col items-center justify-center gap-4 font-normal">
      <div class="pt-6 text-base sm:p-0 sm:text-lg">Sertifiseringer</div>
      <div class="flex gap-2">
        <img
          class="block h-16 dark:hidden sm:h-20"
          alt="Miljøfyrtårn-sertifisering"
          src={miljofyrtarnDark}
        />
        <img
          class="hidden h-16 dark:block sm:h-20"
          alt="Miljøfyrtårn-sertifisering"
          src={miljofyrtarnLight}
        />
        <img class="block h-16 dark:hidden sm:h-20" alt="DNV-sertifisering" src={dnvDark} />
        <img class="hidden h-16 dark:block sm:h-20" alt="DNV-sertifisering" src={dnvLight} />
      </div>
    </div>
    <div class="flex gap-11">
      <a href="https://www.capraconsulting.no/">
        <img class="block h-20 dark:hidden sm:h-28" alt="Capra-logo" src={capraLogoBlack} />
        <img class="hidden h-20 dark:block sm:h-28" alt="Capra-logo" src={capraLogoWhite} />
      </a>
      <a href="https://www.liflig.no/">
        <img class="block h-20 dark:hidden sm:h-28" alt="Liflig-logo" src={lifligLogoBlack} />
        <img class="hidden h-20 dark:block sm:h-28" alt="Liflig-logo" src={lifligLogoWhite} />
      </a>
      <a href="https://www.fryde.no/">
        <img class="block h-20 dark:hidden sm:h-28" alt="Fryde-logo" src={frydeLogoBlack} />
        <img class="hidden h-20 dark:block sm:h-28" alt="Fryde-logo" src={frydeLogoWhite} />
      </a>
    </div>
    <div>
      <a href="/personvern" class="text-base font-normal underline sm:text-lg"
        >Personvernerklæring</a
      >
    </div>
  </div>
  <p class="pt-10 text-center text-sm sm:text-base">
    2024 © Capra | Stenersgata 2 | N-0168 Oslo | <a href="mailto:post@capraconsulting.no"
      >post@capraconsulting.no</a
    >
  </p>
</footer>
