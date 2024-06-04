<script>
  import capraLogo from "$lib/assets/capra-white.webp";
  import frydeLogo from "$lib/assets/fryde-white.webp";
  import lifligLogo from "$lib/assets/liflig-white.webp";
</script>

<footer
  class="flex h-[470px] w-full flex-col items-center justify-center gap-8 bg-black py-16 text-lg font-light text-white sm:gap-12"
>
  <p class="pb-2 pt-6">Vi er en del av Capra-gruppen</p>
  <div class="flex gap-11">
    <img class="h-20 sm:h-28" alt="Capra-logo" src={capraLogo} />
    <img class="h-20 sm:h-28" alt="Liflig-logo" src={lifligLogo} />
    <img class="h-20 sm:h-28" alt="Fryde-logo" src={frydeLogo} />
  </div>
  <p class="pt-10 text-sm sm:text-base">
    2024 © Capra | Stenersgata 2 | N-0168 Oslo | post@capraconsulting.no
  </p>
</footer>
