<template>
  <v-card variant="outlined" class="ma-3 mb-6">
    <v-card-title>
      {{ $t('data_backup') }}
    </v-card-title>
    <v-divider></v-divider>
    <v-list-item link to="/dataExport">
        <v-list-item-title> 
          {{ $t('data_export') }}
        </v-list-item-title>
      </v-list-item>
    <v-divider></v-divider>
    <v-list-item link v-on:click="backupDialog = true; updateDBData()">
      <v-list-item-title> 
        {{ $t('backup') }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item link v-on:click="importDialog = true">
      <v-list-item-title> 
        {{ $t('import') }}
      </v-list-item-title>
    </v-list-item>
  </v-card>

  <!-- BACKUP DIALOG -->
  <v-dialog :width="windowWidth * 0.6" v-model="backupDialog">
    <v-card  class="pa-2">
      <v-card-title> {{ $t('data_backup')}} </v-card-title>

      <v-col cols="12">
          <v-progress-linear
            indeterminate
            rounded
            color="secondary"
            v-if="isLoading">
          </v-progress-linear>
      </v-col>
      <v-col
          class="text-subtitle-1 text-center"
          cols="12"
          v-if="isLoading">
          {{ $t('createBackup') }}
        </v-col>

      <v-row v-if="!isLoading">
        <v-col cols="6">
          <v-card-subtitle>{{ $t('backup')}}:</v-card-subtitle>
          <v-card-text 
            class="ml-8">
            {{ activities.length }} {{ $tc('activity', 2)}}
          </v-card-text>
          <v-card-text 
            class="ml-8">
            {{ places.length }} {{ $tc('place', 2)}}
          </v-card-text>   
          <v-card-text 
            class="ml-8">
            {{ positions.length }} {{ $tc('position', 2)}}
          </v-card-text>   
        </v-col>
        <v-col cols="6">
          <v-card-text>
            {{ images.length }} {{ $tc('image', 2)}}
          </v-card-text>   
          <v-card-text>
            {{ placeModels.length + positionModels.length }} 
            {{ $tc('model', 2)}}
          </v-card-text>   
          <v-card-text>
            {{ cameras.length }} {{ $tc('camera', 2)}}
          </v-card-text>   
          <v-card-text>
            {{ createdChanges.length + deletedChanges.length }} 
            {{ $tc('change', 2)}}
          </v-card-text>   
        </v-col>
      </v-row>
      
      <v-row no-gutters>
        <v-spacer/>
        <v-btn 
          color="primary"
          class="mr-2"
          v-on:click="backupData()">
          <v-icon>mdi-content-save-all</v-icon>
        </v-btn>
    
        <v-btn 
          color="error" 
          v-on:click="backupDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card>
    <v-spacer></v-spacer>
  </v-dialog>

  <!-- IMPORT DIALOG -->
  <v-dialog :width="windowWidth * 0.5" v-model="importDialog">
    <v-card class="pa-2 ma-2">
      <v-card-title> {{ $t('data_import') }} </v-card-title>
    
        <v-file-input
          v-if="!isLoading"
          id="file"
          show-size 
          v-model="importedData" 
          accept=".zip"
          color="primary">
        </v-file-input>
        
        <v-col cols="12">
          <v-progress-linear
            indeterminate
            rounded
            color="secondary"
            v-if="isLoading">
          </v-progress-linear>
        </v-col>
        <v-col
          class="text-subtitle-1 text-center"
          cols="12"
          v-if="isLoading">
          {{ $t('getBackup') }}
        </v-col>
    
      <v-row no-gutters>
        <v-spacer/>
        <v-btn 
          color="primary"
          class="mr-2"
          v-on:click="importData(importedData)">
          <v-icon>mdi-content-save-all</v-icon>
        </v-btn>
      
        <v-btn 
          color="error" 
          v-on:click="importDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
  
<script>
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { toRaw } from 'vue';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'DataBackup',
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },
  data() {
    return {
      backupDialog: false,
      importDialog: false,
      importedData: '',
      activities: [],
      places: [],
      positions: [],
      images: [],
      placeModels: [],
      positionModels: [],
      cameras: [],
      createdChanges: [],
      deletedChanges: [],
      isLoading: false
    };
  },
  methods: {
    async updateDBData() {
      await fromOfflineDB.syncLocalDBs();

      this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities');
      this.places = await fromOfflineDB.getAllObjects('Places', 'places');
      this.positions = await fromOfflineDB.getAllObjects('Positions', 'positions');
      this.images = await fromOfflineDB.getAllObjects('Images', 'images');
      this.placeModels = await fromOfflineDB.getAllObjects('Models', 'places');
      this.positionModels = await fromOfflineDB.getAllObjects('Models', 'positions');
      this.cameras = await fromOfflineDB.getAllObjects('Cameras', 'cameras');
      this.createdChanges = await fromOfflineDB.getAllObjects('Changes', 'created');
      this.deletedChanges = await fromOfflineDB.getAllObjects('Changes', 'deleted');
    },
    /**
     * Consolidates all data of the IndexedDB to 
     * one `.backup`-file and downloads it.
     */
    async backupData() {
      this.isLoading = true
      await this.updateDBData();
      var filename = "fieldbook_" + new Date().toLocaleDateString('DE-de');
      var rawPlaceModels = toRaw(this.placeModels);
      var rawPositionModels = toRaw(this.positionModels);
    
      var zip = new JSZip();
      var modelFiles = [];

      // decode model-files from ArrayBuffer to String
      rawPlaceModels.forEach(model => {
        var blob = new Blob([model.model], { type: "text/plain;charset=utf-8" });
        modelFiles.push(blob);

        zip.file("place." + model.id + ".glb", blob);
      });
      rawPositionModels.forEach(model => {
        var blob = new Blob([model.model], { type: "text/plain;charset=utf-8" });
        modelFiles.push(blob);
        zip.file("position." + model.id + ".glb", blob);
      });

      // combine all IndexedDB stores to one JSON-object
      var backupData = {
        activities: toRaw(this.activities),
        places: toRaw(this.places),
        positions: toRaw(this.positions),
        images: toRaw(this.images),
        placeModels: toRaw(this.placeModels),
        positionModels: toRaw(this.positionModels),
        cameras: toRaw(this.cameras),
        createdChanges: toRaw(this.createdChanges),
        deletedChanges: toRaw(this.deletedChanges),
      }
      
      var backupDataString = JSON.stringify(backupData);
      // create blob of the IndexedDB data
      var blob = new Blob([backupDataString], { type: "text/plain;charset=utf-8" });
      // add the data .txt to the zip
      zip.file(filename + ".txt", blob);

      await zip.generateAsync({ type: "blob" }).then(function (content) {
        var fileName = "fieldbookBackup_" + new Date().toLocaleDateString("en-EN") + ".zip" 
        // see FileSaver.js
        saveAs(content, fileName);
      });

      // close the import dialog
      this.importDialog = false;
      this.$router.go();
    },

    /**
     * Imports a `.backup` file to create the system 
     * state as it was, when the backup was created.
     * @param {*} file 
     */
    async importData(file) {
      this.isLoading = true
      const context = this;
      var rawFile = toRaw(file);
      var modelFiles = [];
      var dbData = {};
      // add all the data back to their corresponding IndexedDB stores
      
      var zipData = await JSZip.loadAsync(rawFile[0]);
      var fileKeys = Object.keys(zipData.files);
      
      // retrieve data from the backup.zip and write it to dbData + modelFiles
      for (var i=0; i<fileKeys.length; i++) {
        var fileEnd = fileKeys[i].split(".");
        
        if (fileEnd[fileEnd.length - 1] == "txt") {
          await zipData.files[fileKeys[i]].async('string').then(function (fileData) {
            dbData = JSON.parse(fileData);
          })
        } else if (fileEnd[fileEnd.length - 1] == "glb") {
          await zipData.files[fileKeys[i]].async('arraybuffer').then(function (fileData) {
            
            var modelObject = {};
            modelObject.type = fileEnd[0];
            modelObject.id = fileEnd[1];
            modelObject.data = fileData;

            modelFiles.push(modelObject);
          })
        }
      }

      // combine the model ArrayBuffers to the correct model of the dbData
      // (depending on placeModel and positionModel)
      modelFiles.forEach(model => {
        if (model.type == "place") {

          for (var i = 0; i < dbData.placeModels.length; i++) {
            if (model.id == dbData.placeModels[i].id) {
              dbData.placeModels[i].model = model.data;
            }
          }

        } else if (model.type == "position") {

          for (var j = 0; j < dbData.positionModels.length; j++) {
            if (model.id == dbData.positionModels[j].id) {
              dbData.positionModels[j].model = model.data;
            }
          }
        }
      });

      // add the data back to IndexedDB
      await context.addData(dbData.activities, 'Activities', 'activities');
      await context.addData(dbData.places, 'Places', 'places');
      await context.addData(dbData.positions, 'Positions', 'positions');
      await context.addData(dbData.images, 'Images', 'images');
      await context.addData(dbData.placeModels, 'Models', 'places');
      await context.addData(dbData.positionModels, 'Models', 'positions');
      await context.addData(dbData.cameras, 'Cameras', 'cameras');
      await context.addData(dbData.createdChanges, 'Changes', 'created');
      await context.addData(dbData.deletedChanges, 'Changes', 'deleted');

      // close the import dialog
      this.importDialog = false;
      this.$router.go();
    },

    /**
     * Adds all Objects within the data-array back to 
     * the corresponding IndexedDB store by `dbName` and `storeName`
     * @param {[Object]} data 
     * @param {String} dbName 
     * @param {String} storeName 
     */
    async addData(data, dbName, storeName ) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var allPreset = '';

          if (dbName == 'Places') {

            // join old title that consisted of multiple titles in an array
            // to one continuous string
            if (Array.isArray(data[i].title)){
              data[i].title = data[i].title.join(';');
            }

            // technical place for first place
             if (i == 0) {
              allPreset = await fromOfflineDB.getObjectByIndex(0, 'ModulePresets', 'places');
            // otherwise use ALL preset
            } else {
              allPreset = await fromOfflineDB.getObjectByIndex(1, 'ModulePresets', 'places');
            }
            
          } else if (dbName == 'Positions') {
            allPreset = await fromOfflineDB.getObjectByIndex(0, 'ModulePresets', 'positions');
          }

          if (data[i].modulePreset == undefined) {
            data[i].modulePreset = allPreset;
          }
        
          // encode the model file, if the data is for a model
          await fromOfflineDB.addObject(data[i], dbName, storeName);
        }
      }
    },
    
  }
}
</script>
  
<style>

</style>