<script>
  import capraLogoWhite from "$lib/assets/capra-white-vertical.webp";
  import frydeLogoWhite from "$lib/assets/fryde-white-vertical.webp";
  import lifligLogoWhite from "$lib/assets/liflig-white-vertical.webp";
  import capraLogoBlack from "$lib/assets/capra-black-vertical.webp";
  import frydeLogoBlack from "$lib/assets/fryde-black-vertical.webp";
  import lifligLogoBlack from "$lib/assets/liflig-black-vertical.webp";
</script>

<footer
  class="gap-8py-16 flex h-[470px] w-full flex-col items-center justify-center text-lg font-light sm:gap-12"
>
  <p class="pb-2 pt-6">Vi er en del av Capra-gruppen</p>
  <div class="flex gap-11">
    <a href="https://www.capraconsulting.no/">
      <img class="block h-20 sm:h-28 dark:hidden" alt="Capra-logo" src={capraLogoBlack} />
      <img class="hidden h-20 sm:h-28 dark:block" alt="Capra-logo" src={capraLogoWhite} />
    </a>
    <a href="https://www.liflig.no/">
      <img class="block h-20 sm:h-28 dark:hidden" alt="Liflig-logo" src={lifligLogoBlack} />
      <img class="hidden h-20 sm:h-28 dark:block" alt="Liflig-logo" src={lifligLogoWhite} />
    </a>
    <a href="https://www.fryde.no/">
      <img class="block h-20 sm:h-28 dark:hidden" alt="Fryde-logo" src={frydeLogoBlack} />
      <img class="hidden h-20 sm:h-28 dark:block" alt="Fryde-logo" src={frydeLogoWhite} />
    </a>
  </div>
  <p class="pt-10 text-center text-sm sm:text-base">
    2024 © Capra | Stenersgata 2 | N-0168 Oslo | post@capraconsulting.no
  </p>
</footer>
