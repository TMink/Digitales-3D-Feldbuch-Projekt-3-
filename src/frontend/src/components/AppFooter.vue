<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 27.03.2024 13:08:31
 * Modified By: Julian Hardtung
 * 
 * Description: app footer of the fieldbook
 -->

<template>
    <v-footer style="z-index: 1;" app>
        <v-row>
            <v-col icon class="text-center pa-0">
                {{ new Date().getFullYear() }} — <strong>TH-Köln</strong>
                <v-btn  icon  
                        variant="text" 
                        href="https://www.th-koeln.de/informatik-und-ingenieurwissenschaften/fakultaet-fuer-informatik-und-ingenieurwissenschaften_2466.php" 
                        target="_blank"
                        >
                    <v-icon><v-img src="assets/logos/THCologne_Icon.png"></v-img></v-icon>
                </v-btn> 
            </v-col>
        </v-row>
    </v-footer>
</template>
  
<script>
export default {
    name: 'AppFooter'
}
</script>
  
<style></style>
  