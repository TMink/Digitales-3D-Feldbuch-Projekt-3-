<!--
 * Created Date: 07.06.2023 17:36:09
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 14:26:00
 * Modified By: Julian Hardtung
 * 
 * Description: customizable confirm dialog for editing/deleting etc.
 -->

<template>
    <v-dialog v-model="dialog" :max-width="options.width" style="z-index: 3;" @keydown.esc="cancel">
        <v-card>
            <v-toolbar dark :color="options.color" dense flat>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>
            <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn icon color="success"  @click="agree"><v-icon>mdi-check-circle</v-icon></v-btn>
                <v-btn icon color="error" @click="cancel"><v-icon>mdi-close-circle</v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    data: () => ({
        dialog: false,
        resolve: null,
        reject: null,
        message: null,
        title: null,
        options: {
            color: 'warning',
            width: 290,
        }
    }),
    methods: {
        open(title, message, options) {
            this.dialog = true
            this.title = title
            this.message = message
            this.options = Object.assign(this.options, options)
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        agree() {
            this.resolve(true)
            this.dialog = false
        },
        cancel() {
            this.resolve(false)
            this.dialog = false
        }
    }
}
</script>