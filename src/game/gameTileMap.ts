/*
 Copyright (C) 2013-2015 by Justin DuJardin and Contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import * as _ from 'underscore';
import {GameWorld} from './gameWorld';
import {GameFeatureObject} from './rpg/objects/gameFeatureObject';
import * as rpg from './rpg/game';
import {TileMap} from './pow2/tile/tileMap';
import {TileObject} from './pow2/tile/tileObject';
import {ITiledObject} from './pow-core/resources/tiled/tiled';
import {Point} from './pow-core/point';
import {Rect} from './pow-core/rect';
import {SceneComponent} from './pow2/scene/sceneComponent';
import {SceneObject} from './pow2/scene/sceneObject';

/**
 * A tile map that supports game feature objects and components.
 */
export class GameTileMap extends TileMap {
  world: GameWorld;

  musicUrl: string;

  loaded() {
    super.loaded();
    this.musicUrl = '';
    if (this.map.properties && this.map.properties.music) {
      this.musicUrl = this.map.properties.music;
    }
    this.buildFeatures();
  }

  destroy() {
    this.unloaded();
    return super.destroy();
  }

  unloaded() {
    this.removeFeaturesFromScene();
    super.unloaded();
  }

  getFeature(name: string) {
    return _.find(<any>this.features.objects, (feature: any) => {
      return feature.name === name;
    });
  }

  // Construct
  addFeaturesToScene() {
    _.each(this.features.objects, (obj: any) => {
      obj._object = this.createFeatureObject(obj);
      if (obj._object) {
        this.scene.addObject(obj._object);
      }
    });
  }

  removeFeaturesFromScene() {
    _.each(this.features.objects, (obj: any) => {
      var featureObject: SceneObject = <SceneObject>obj._object;
      delete obj._object;
      if (featureObject) {
        featureObject.destroy();
      }
    });
  }

  buildFeatures(): boolean {
    this.removeFeaturesFromScene();
    if (this.scene) {
      this.addFeaturesToScene();
    }
    return true;
  }

  createFeatureObject(tiledObject: ITiledObject): TileObject {
    var options = _.extend({}, tiledObject.properties || {}, {
      tileMap: this,
      type: tiledObject.type,
      x: Math.round(tiledObject.x / this.map.tilewidth),
      y: Math.round(tiledObject.y / this.map.tileheight)
    });
    var object = new GameFeatureObject(options);
    this.world.mark(object);

    console.warn('Feature component instantiation is busted because getClassType was deprecated');
    // var componentType: any = tiledObject.type === 'alert' ? null : EntityContainerResource.getClassType(tiledObject.type);
    const componentType: any = null;
    if (tiledObject.type && componentType) {
      var component = <SceneComponent>(new componentType());
      if (!object.addComponent(component)) {
        throw new Error("Component " + component.name + " failed to connect to host " + this.name);
      }
    }
    return object;
  }

  /**
   * Enumerate the map and target combat zones for a given position on this map.
   * @param at The position to check for a sub-zone in the map
   * @returns {IZoneMatch} The map and target zones that are null if they don't exist
   */
  getCombatZones(at: Point): rpg.IZoneMatch {
    var result: rpg.IZoneMatch = {
      map: null,
      target: null,
      targetPoint: at,
      fixed: false
    };
    if (this.map && this.map.properties && this.map.properties) {
      if (typeof this.map.properties.combatZone !== 'undefined') {
        result.map = this.map.properties.combatZone
      }
    }
    // Determine which zone and combat type
    var invTileSize = 1 / this.map.tilewidth;
    var zones: any[] = _.map(this.zones.objects, (z: any)=> {
      var x = z.x * invTileSize;
      var y = z.y * invTileSize;
      var w = z.width * invTileSize;
      var h = z.height * invTileSize;
      return {
        bounds: new Rect(x, y, w, h),
        name: z.name
      }
    });
    // TODO: This will always get the first zone.  What about overlapping zones?
    var zone = _.find(zones, (z: any)=> {
      return z.bounds.pointInRect(at) && z.name;
    });
    if (zone) {
      result.target = zone.name;
    }
    return result;
  }

}
