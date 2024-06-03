<script>
  import capraLogo from "$lib/assets/capra-white.webp";
  import frydeLogo from "$lib/assets/fryde-white.webp";
  import lifligLogo from "$lib/assets/liflig-white.webp";
</script>

<footer
  class="bg-black h-[470px] w-full text-white font-light text-lg flex flex-col items-center justify-center sm:gap-12 gap-8 py-16"
>
  <p class="pt-6 pb-2">Vi er en del av Capra-gruppen</p>
  <div class="flex gap-11">
    <img class="h-20 sm:h-28" alt="Capra-logo" src={capraLogo} />
    <img class="h-20 sm:h-28" alt="Liflig-logo" src={lifligLogo} />
    <img class="h-20 sm:h-28" alt="Fryde-logo" src={frydeLogo} />
  </div>
  <p class="pt-10 sm:text-base text-sm text-center">
    2024 © Capra | Stenersgata 2 | N-0168 Oslo | post@capraconsulting.no
  </p>
</footer>
