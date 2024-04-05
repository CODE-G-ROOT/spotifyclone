<script lang="ts">
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greating = "";

  if (currentHour < 12) {
    greating = "Buenos Dias";
  } else if (currentHour < 18 ) {
    greating = "Buenas Tardes";
  } else {
    greating = "Buenas Noches"
  }

</script>

<h1 class="text-3xl font-bold">{greating}</h1>