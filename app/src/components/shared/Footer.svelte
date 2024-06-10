<script>
  import capraLogoWhite from "$lib/assets/capra-white-vertical.webp";
  import frydeLogoWhite from "$lib/assets/fryde-white-vertical.webp";
  import lifligLogoWhite from "$lib/assets/liflig-white-vertical.webp";
  import miljo from "$lib/assets/miljofyrtarn.png";
  import dnv from "$lib/assets/dnv.png";
</script>

<footer
  class="gap-8py-16 flex h-[470px] w-full flex-col items-center justify-center bg-black text-lg font-light text-white sm:gap-12"
>
  <p class="pb-2 pt-6">Vi er en del av Capra-gruppen</p>
  <div class="flex w-full flex-col items-center justify-evenly sm:flex-row">
    <div class="flex flex-col items-center justify-center gap-4 font-normal">
      <div>Sertifiseringer</div>
      <div class="flex gap-2">
        <img class="h-20" alt="Miljøfyrtårn-sertifisering" src={miljo} />
        <img class="h-20" alt="DNV-sertifisering" src={dnv} />
      </div>
    </div>
    <div class="flex gap-11">
      <a href="https://www.capraconsulting.no/">
        <img class="h-20 sm:h-28" alt="Capra-logo" src={capraLogoWhite} />
      </a>
      <a href="https://www.liflig.no/">
        <img class="h-20 sm:h-28" alt="Liflig-logo" src={lifligLogoWhite} />
      </a>
      <a href="https://www.fryde.no/">
        <img class="h-20 sm:h-28" alt="Fryde-logo" src={frydeLogoWhite} />
      </a>
    </div>
    <div>
      <a href="/personvern" class="font-normal underline">Personvernerklæring</a>
    </div>
  </div>
  <p class="pt-10 text-center text-sm sm:text-base">
    2024 © Capra | Stenersgata 2 | N-0168 Oslo | <a href="mailto:post@capraconsulting.no"
      >post@capraconsulting.no</a
    >
  </p>
</footer>
