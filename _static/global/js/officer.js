let probabilityBarComponent = {
    props: {
        label: String,
        percent: Number,
    },
    data: function () {
        return {}
    },
    template:
        `
        <div>
            <div class="title-small">{{ label }} <strong>{{percent}}%</strong></div>
            <div class='bar'>
                <div class="innocent" :style="{'width':(percent+'%')}">
                </div>
            </div>
        </div>
        `
}

let officerGameComponent = {
    components: {
        'probability-bar-component': probabilityBarComponent,
    },
    props: {
        maps: Array,
        officerUnits: Array,
        officerIncome: Number,
        groupPlayerId: String,
        investigationCount: Number,
        probCulprit: Number,
        probInnocent: Number,
        policeLogMessages: Array,
        mapSize: Number,
        defendTokenSize: Number,
    },
    data: function () {
        return {
            playerId: Number,
            locationx: String,
            locationy: String,
            map: String,
        }
    },
    created: function () {
        this.locationx = '';
        this.locationy = '';
        this.map = '';
    },
    mounted: function () {
        for (let i = 0; i < this.officerUnits.length; i++) {
            let oGame = document.getElementById("officerGame");
            let that = this;
            let drag = Draggable.create("#unit" + i, {
                minimumMovement: .01,
                bounds: document.getElementById("officerGame"), //todo add ref stuff after vuex is implemented
                onDragStart: function () {
                    that.tokenDragStart(this, that.officerUnits[i])
                },
                onDragEnd: function () {
                    that.checkLocation(this, that.officerUnits[i])
                },
            });
            drag.zIndex = 500;
        }
    },
    methods: {
        tokenDragStart: function (that, item) {
            // console.log(item)
            this.$emit('token-drag', item);
            // // update api with unit location
            // this.updateOfficerToken(item);
        },
        checkLocation: function (that, item) {
            if (that.hitTest(this.$refs.officerGame, '100%')) {
                //location-center
                if (that.hitTest(this.$refs.map5, '1%')) {
                    this.map = 5
                    item.map = 5;
                    let map = document.getElementById('map5').getBoundingClientRect()
                    this.calculateLocation(map, that, item);
                } else if (that.hitTest(this.$refs.map2, '.000001%')) {
                    this.map = 2
                    item.map = 2;
                    let map = document.getElementById('map2').getBoundingClientRect()
                    this.calculateLocation(map, that, item);
                } else if (that.hitTest(this.$refs.map3, '.000001%')) {
                    this.map = 3
                    item.map = 3
                    let map = document.getElementById('map3').getBoundingClientRect()
                    this.calculateLocation(map, that, item);
                } else if (that.hitTest(this.$refs.map4, '.000001%')) {
                    this.map = 4
                    item.map = 4
                    let map = document.getElementById('map4').getBoundingClientRect()
                    this.calculateLocation(map, that, item);
                } else if (that.hitTest(this.$refs.investigationcontainer, '100%')) {
                    item.map = 11
                    this.$emit('investigation-update', item)
                } else {
                    gsap.to(that.target, 0.5, {x: 0, y: 0, ease: Back.easeOut});
                    this.$emit('defense-token-reset', item.number)
                }
            } else {
                gsap.to(that.target, 0.5, {x: 0, y: 0, ease: Back.easeOut});
                this.$emit('defense-token-reset', item.number)
            }
        },
        calculateLocation: function(map, unitContext, item) {
            let unit = unitContext.target.getBoundingClientRect()
            this.locationy = unit.y - map.y - 1;
            this.locationx = unit.x - map.x - 1;
            item.x = this.locationx;
            item.y = this.locationy;

            // update api with unit location
            this.updateOfficerToken(item);
        },
        updateOfficerToken: function(item) {
            // console.log('item: ', item);
            this.$emit('token-update', item);
        }
    },
    template:
        `
          <div ref="officerGame">
              <div class="upper">      
                <div class='title'>Civilian Maps</div> 
                <div class="maps-container">
                    <div v-for="map in maps" v-bind:player-id="(map+1)" :id='"map" + (map+1)' :ref='"map" + (map+1)' class="map-container">
                      <div class="map other" v-bind:player-id="(map+1)" :id='"map" + (map+1)' :ref='"map" + (map+1)'>
                          <svg v-for="player_id in 4" :key="player_id" :id="'indicator' + (map+1) + '-' + (player_id + 1)" class="indicator" width="6" height="6">
                            <circle cx="3" cy="3" r="2" fill="black" />
                          </svg>
                      </div>
                      <div class="map-label">
                        Player {{map+1}}
                      </div>
                    </div>
                </div>
                <div class="token-container">
                    <div style="margin: 10px">
                        <div class="title-small">
                            Each fine imposed earns <strong>{{officerIncome}}</strong> grain 
                        </div>
                    </div>
                    <div class="officer-units" style="display:flex;">
                        <div v-for="(unit, index) in officerUnits" :id="'unit'+index" class="officer-unit" :ref='"unit" + unit'>
                        </div>
                    </div>
                </div>
              </div>
              <div class="lower">
                <div class="investigation-data-container">
                  <div class="title">Investigating</div>
                    <div>
                        <probability-bar-component label="Probability Fine Innocent" :percent=probInnocent></probability-bar-component>
                        <probability-bar-component label="Probability Fine Culprit" :percent=probCulprit></probability-bar-component>
                    </div>
                  <br>
                  <div class="title-small">Investigation Map</div>
                  <div id="officer-investigation-container" ref='investigationcontainer'></div>
    
                </div>
              </div>
          </div>
      `
}