let probabilityBarComponent = {
    props: {
        label: String,
        percent: Number,
    },
    data: function () {
        return {
            defenseTokens: []
        }
    },
    template:
        `
        <div>
            <div class="title-small">{{ label }}: <strong>{{percent}}%</strong></div>
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
        initialDefendTokens: Array,
        officerIncome: Number,
        groupPlayerId: Number,
        investigationCount: Number,
        defendTokenTotal: Number,
        policeLogMessages: Array,
        mapSize: Number,
        defendTokenSize: Number,
        probabilityReprimand: Number,
        reprimandAmount: Number,
    },
    data: function () {
        return {
            playerId: Number,
            locationx: String,
            locationy: String,
            map: String,
            activeCount: 0,
            mutableDefendTokens: Array,
            defendSlotStatuses: [],
        }
    },
    created: function () {
        for (let i = 0; i < this.initialDefendTokens.length; i++)
            this.defendSlotStatuses.push(true);

        this.mutableDefendTokens = this.initialDefendTokens;
        this.locationx = '';
        this.locationy = '';
        this.map = '';
    },
    mounted: function () {
        for (let i = 0; i < this.mutableDefendTokens.length; i++) {
            let that = this;
            let drag = Draggable.create("#unit" + (i+1), {
                minimumMovement: .01,
                bounds: this.$refs['officerGame'],
                onDragStart: function () {
                    that.tokenDragStart(this, that.mutableDefendTokens[i]);
                    // update map as dragging and adjust which tokens are active
                    if (that.mutableDefendTokens[i].map === 0) {
                        that.activeCount++;
                        that.defendSlotStatuses[that.mutableDefendTokens[i].slot-1] = false; // we should set their last location not based off their number dumdum
                    }
                    that.mutableDefendTokens[i].map = -1;
                },
                onDragEnd: function () {
                    that.validateLocation(this, that.mutableDefendTokens[i])
                },
            });
        }
    },
    methods: {
        disableToken: function(id) {
            let selector = "#unit" + id;
            let dragToken = Draggable.get(selector);
            dragToken.disable();
            // gsap.to(selector, {background: 'red'});
            setTimeout(() => {
                dragToken.enable()
            }, 1000)
        },
        tokenDragStart: function (that, token) {
            this.$emit('token-drag', token);
        },
        validateLocation: function (that, token) {
            if (that.hitTest(this.$refs.officerGame, '100%')) {
                for (let i in this.maps) {
                    let id = parseInt(this.maps[i]) + 1;

                    if (that.hitTest(this.$refs['map' + id], '.000001%')) {
                        this.map = id;
                        token.map = id;
                        let map = this.$refs['map' + id][0].getBoundingClientRect();
                        this.calculateLocation(map, that, token);
                        return;
                    }
                }

                if (that.hitTest(this.$refs.investigationcontainer, '100%')) {
                    token.map = 11;
                    this.$emit('investigation-update', token);
                    return;
                }
            }

            this.resetDefendToken(that.target, token)
        },
        calculateLocation: function(map, unitContext, token) {
            let unit = unitContext.target.getBoundingClientRect();
            this.locationy = unit.y - map.y - 1;
            this.locationx = unit.x - map.x - 1;
            token.x = this.locationx;
            token.y = this.locationy;
            this.disableToken(token.number-1);
            // update api with unit location
            this.updateDefendToken(token);
        },
        updateDefendToken: function(token) {
            this.$emit('token-update', token);
        },
        resetDefendToken: function(tokenElm, token) {
            // calculate where to send
            let randSlot = this.randomLocation();
            let i = 0;
            let count = 0;
            for(i; i<this.defendSlotStatuses.length; i++) {
                if (!this.defendSlotStatuses[i])
                    count++;
                else
                    continue;

                // did we reach the randth element?
                if (count === randSlot)
                    break
            }

            let start = this.$refs['defendlocation' + (token.number)][0].getBoundingClientRect();
            let dest = this.$refs['defendlocation' + (i+1)][0].getBoundingClientRect();
            gsap.to(tokenElm, 0, {x: dest.x - start.x, y: dest.y - start.y});

            // reset values slot status to occupied
            this.activeCount--;
            this.defendSlotStatuses[token.slot-1] = true;
            token.map = 0;
            token.slot = i+1;

            this.$emit('defense-token-reset', token);

        },
        randomLocation: function() {
            // returns rand number 1-number of open defense token slots
            let count = Math.floor(Math.random() * this.activeCount) + 1;
            return count;
        }
    },
    template:
        `
          <div ref="officerGame">
              <div class="upper">      
                <div class='title'>Civilian Maps</div> 
                <div class="maps-container">
                    <div v-for="map in maps" v-bind:player-id="(map+1)" :id='"map" + (map+1)' :ref='"map" + (map+1)' class="map-container">
                      <div class="map other" :id='"map" + (map+1)' :ref='"map" + (map+1)' v-bind:style="{ height: mapSize + 'px', width: mapSize + 'px' }">
                            <div v-for="player_id in 5" class="intersection-label" :id="'intersection-label-' + (map+1) + '-' + (player_id + 1)" >
                                -1
                            </div>
                            <svg v-for="player_id in 5" :key="player_id" :id="'indicator-' + (map+1) + '-' + (player_id + 1)" class="indicator" width="6" height="6">
                                <circle cx="3" cy="3" r="2" fill="black" />
                            </svg>
                      </div>
                      <div class="map-label">
                        Civilian {{map+1}}
                      </div>
                    </div>
                </div>
                <div class="token-container">
                    <div style="margin: 10px">
                        <div class="title-small officer-info-container">
                            <div class="title-small data-row">
                                <div class="left">Amount earned per arrest: </div>
                                <div class="right" style="color: green; font-weight: bold;"><div class="number-right-align">{{officerIncome}}</div></div>
                            </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                    <div class="officer-units" style="display:flex;">
                        <div 
                            v-for="(unit, index) in mutableDefendTokens" 
                            :ref="'defendlocation'+(unit.number)"
                            :id="'defendslot' + (unit.number)" 
                            class="defend-location" 
                            v-bind:style="{ height: defendTokenSize + 'px', width: defendTokenSize + 'px' }"
                        >
                            <div 
                                :id="'unit' + unit.number" 
                                :ref='"unit" + unit.number'
                                class="officer-unit" 
                                v-bind:style="{ height: defendTokenSize + 'px', width: defendTokenSize + 'px' }"
                            >
                            </div>
                        </div>
                    </div>
                    
                    <div class="officer-info-container">
                        <div class="title-small data-row">
                            <div class="left">Amount lost per reprimand: </div>
                            <div class="right" style="color: red; font-weight: bold;"><div class="number-right-align">{{reprimandAmount}}</div></div>
                        </div>
                        <div style="clear: both;"></div>
                        <div class="title-small data-row">
                            <div class="left">Probability of reprimand: </div>
                            <div class="right" style="color: red; font-weight: bold;"><div class="number-right-align">{{probabilityReprimand}}%</div></div>
                        </div>
                    </div>
                </div>
                <div class="investigation-data-container">
                    <div class="title">Investigation Map</div>
                    <div id="officer-investigation-container" ref='investigationcontainer' v-bind:style="{ height: mapSize + 'px' }"></div>
                </div>
              </div>
          </div>
      `
}