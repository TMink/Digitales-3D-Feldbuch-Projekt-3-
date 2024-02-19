/*
 * Created Date: 10.12.2023 15:32:15
 * Author: Tobias Mink
 * 
 * Last Modified: 19.02.2024 14:16:50
 * Modified By: Tobias Mink
 * 
 * Description: 
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

import { UpdateLocalVariables } from './UpdateLocalVariables.js'
import { Utilities } from './Utilities.js'
import { fromOfflineDB } from '../../ConnectionToOfflineDB.js'
import { exParams } from './Parameter.js';
export class ObjectLoaders {

  /**
   * @param {*} objectData
   */
  async load( objectData ) {
    switch ( objectData.loaderType ) {
      case 'glb' || 'gltf':
        const loader = new GLTFLoader()
        const malfoy = new DRACOLoader()
        malfoy.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        malfoy.setDecoderConfig({type: 'js'});
        loader.setDRACOLoader( malfoy )
        const id = objectData._id
        const object = await new Promise( ( resolve ) => {
          loader.parse( objectData.model, '', ( glb ) => {
            glb.scene.traverse( ( child ) => {
              if ( child instanceof THREE.Mesh ) {
                child.name = id
              }
            } )
            resolve( glb.scene );
          });
        });
        return object

      default:
        console.log("No valid loaderType");
        break;
    }
  }

  async loadObjectsInScene( exParams, objectType, placeID ) {

    // Init loader and updater
    const updater = new UpdateLocalVariables()
    const utilities = new Utilities()
    const objectsToBeLoaded = [];
    const objectsToBeDeleted = [];

    // Get all objects of chosen place
    const objects = await fromOfflineDB.getAllObjectsWithID( placeID, 'Place',
      'Models', objectType );

    if ( objects ) {
      switch ( objectType ) {
        case 'places':
          objects.forEach( object => {
            objectsToBeLoaded.push( object )
          } );
          // if ( exParams.main.objects.place._ids.length > 0 ) {

          //   // check if a change has happened
          //   if ( exParams.main.objects.token ) {

          //     // const comparer = (a, b) => a._id === b._id;
              
          //     // const onlyInLeft = ( left, right, compareFunction ) => 
          //     //   left.filter( leftValue =>
          //     //     !right.some( rightValue => 
          //     //       compareFunction( leftValue, rightValue ) ) );

          //     // const onlyInAllObjects = onlyInLeft( 
          //     //   exParams.main.objects.place._ids, objects, comparer );
          //     // const onlyInObjects = onlyInLeft( 
          //     //   objects, exParams.main.objects.place._ids, comparer );

          //     // console.log( onlyInAllObjects )
          //     // console.log( onlyInObjects )

          //     // check if objects were added or deleted
          //     // add or delete object entrys in variable storage
              
              
          //     /* Check if any id(DB) is not inside exParams ids-array */
          //     // objects.forEach( object => {
          //     //   console.log(exParams.main.objects.place._ids)
          //     //   console.log(object._id)
          //     //   if ( !exParams.main.objects.place._ids.some( id => id === object._id ) ) {
          //     //     objectsToBeLoaded.push( object )
          //     //     console.log(object)
          //     //   }
          //     // } );

          //     const objectIDs = []
          //     objects.forEach( object => {
          //       objectIDs.push( object._id );
          //     } )
          //     /* Check if any id(exParams) is not inside DB ids-array */

          //     console.log(objectIDs)
          //     console.log(exParams.main.objects.place._ids)
              
          //     // set token to false
          //     exParams.main.objects.token = false;
          //   } 

          //   // load variable storage
          //   exParams.main.objects.place.groups.forEach( object => {
          //     exParams.main.scene.add( object );
          //   } )

          //   // if( exParams.main.objects.place.entry.length > objects.length ) {

          //   //   console.log( "Entry/-s must me deletet" )

          //   //   /**
          //   //    * Get objects which are no longer in IndexedDB, but still
          //   //    * currently present in variable storage
          //   //    */
          //   //   objects.forEach( object => {
          //   //     exParams.main.objects.place.entry.forEach( entry => {
          //   //       if ( entry._id != object._id ) {
          //   //         objectsToBeDeleted.push( entry )
          //   //       }
          //   //     } )
          //   //   } )
          //   //   console.log( objectsToBeDeleted )

          //   //   /**
          //   //    * Delete objects which are no longer in IndexedDB.
          //   //    */
          //   //   this.deleteObjectsFromExParams( 'place', objectsToBeDeleted )

          //   //   /**
          //   //    * Add remaining objects to scene.
          //   //    */
          //   //   exParams.main.objects.place.groups.forEach( object => {
          //   //     exParams.main.scene.add( object );
          //   //   } )

          //   // } else if ( exParams.main.objects.place.entry.length < objects.length ) {

          //   //   console.log( "Entry/-s must me added" )
          //   //   utilities.getNewObjects( exParams.main.objects.place._ids, objects, 
          //   //     objectsToBeLoaded );
          //   //   exParams.main.objects.place.groups.forEach( object => {
          //   //     exParams.main.scene.add( object );
          //   //   } )

          //   // }

            
            
          // } else {
          //   objects.forEach( object => {
          //     objectsToBeLoaded.push( object )
          //   } );
          // }
          break;
        case 'positions':
          objects.forEach( object => {
            objectsToBeLoaded.push( object )
          } );
          // if ( exParams.main.objects.position._ids.length > 0 ) {
          //   utilities.getNewObjects( exParams.main.objects.position._ids, objects, 
          //     objectsToBeLoaded );
          //     exParams.main.objects.position.groups.forEach( object => {
          //       exParams.main.scene.add( object );
          //     } )
          // } else {
          //   objects.forEach( object => {
          //     objectsToBeLoaded.push( object )
          //   } );
          // }
          break;
      }
      
      if ( objectsToBeLoaded.length > 0 ) {
        for ( var i = 0; i < objectsToBeLoaded.length; i++ ) {
          
          // Raw object wich hasent been added to the scene
          const loadedObject = await this.load( objectsToBeLoaded[ i ] );
          
          // Updated the position parameters of the object, if the object was
          // already part of the scene. This is enables the system to "remember"
          // the current rotation, coordinates and scale of the object. Also
          // returns an entry to be saved for better overview of currently
          // loaded objects.
          const updated = updater.updateLoadedObject
            ( objectType, objectsToBeLoaded[ i ], loadedObject )
          
          // Push new entry
          if ( objectType === 'places') {
            exParams.main.objects.place._ids.push( updated.entry._id );
            exParams.main.objects.place.titles.push( updated.entry.title );
            exParams.main.objects.place.groups.push( updated.object );
            exParams.main.objects.place.amount++;

            exParams.main.objects.place.entry.push( {
              _id: updated.entry._id,
              placeID: updated.entry.placeID,
              title: updated.entry.title,
              group: updated.object
            } );
          } else if ( objectType === 'positions' ) {
            exParams.main.objects.position._ids.push( updated.entry._id );
            exParams.main.objects.position.titles.push( updated.entry.title );
            exParams.main.objects.position.groups.push( updated.object );
            exParams.main.objects.position.amount++;

            exParams.main.objects.position.entry.push( {
              _id: updated.entry._id,
              positionID: updated.entry.positionID,
              title: updated.entry.title,
              group: updated.object,
              position: updated.position,
              bbox: updated.bbox
            } );
          }

          // Add loaded object to scene
          exParams.main.scene.add( updated.object );
          exParams.main.objects.allObjects.push( updated.object );
        }
      }     
    }
  }
    }

  }
}