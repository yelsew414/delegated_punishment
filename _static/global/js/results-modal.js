let resultsModalComponent = {
    props: {
        resultsObj: Object,
        roundNumber: Number,
    },
    data: function() {
        return {

        }
    },
    methods: {
        openModal: function() {
            this.$refs.rmodal.style.display = 'block';
        }
    },
    template:
        `
        <div ref="rmodal" class="modal">

            <!-- Modal content -->
            <div v-if="resultsObj" class="modal-content results-modal">
                <h4 style="text-align: center;">Round {{ roundNumber }} results</h4>
                
                <p style="text-align: center;">Earnings summary</p>
                <div class="list-group" style="width: 350px; margin: auto;">
                     <div v-if="resultsObj.balance != null" class="list-group-item">
                        <div style="display: flex; justify-content: space-between;">
                            <div>After tax earnings <img src="https://i.imgur.com/BQXgE3F.png" alt="grain" style="height: 20px;"></div>
                            <div>{{resultsObj.balance}}</div>
                        </div>
                    </div>
                    <div v-if="resultsObj.before_tax != null" class="list-group-item">
                        <div style="display: flex; justify-content: space-between;">
                            <div>Before tax earnings <img src="https://i.imgur.com/BQXgE3F.png" alt="grain" style="height: 20px;"></div>
                            <div>{{ resultsObj.before_tax }}</div>
                        </div>
                    </div>
                    <div v-if="resultsObj.defend_token_cost != null" class="list-group-item">
                        <div style="display: flex; justify-content: space-between;">
                            <div>Taxes <img src="https://i.imgur.com/BQXgE3F.png" alt="grain" style="height: 20px;"></div>
                            <div>{{ resultsObj.your_tax }}</div>
                        </div>
                    </div>              
                </div>
                <br>
                
                <p style="text-align: center;">Token summary</p>
                <div class="list-group" style="width: 350px; margin: auto;">
                     <div v-if="resultsObj.your_tokens != null" class="list-group-item list-group-item-primary">
                        <div style="display: flex; justify-content: space-between;">
                            <div><strong>Your tokens:</strong></div>
                            <div><strong>{{resultsObj.your_tokens}}</strong></div>
                        </div>
                    </div>
                    <div v-if="resultsObj.your_tax != null" class="list-group-item list-group-item-primary">
                        <div style="display: flex; justify-content: space-between;">
                            <div><strong>Your cost:</strong></div>
                            <div><strong>{{ resultsObj.your_tax }}</strong></div>
                        </div>
                    </div>
                    <div v-if="resultsObj.defend_token_cost != null" class="list-group-item list-group-item-primary">
                        <div style="display: flex; justify-content: space-between;">
                            <div>Total cost:</div>
                            <div>{{ resultsObj.defend_token_cost }}</div>
                        </div>
                    </div>    
                    <div v-if="resultsObj.fine_total != null" class="list-group-item list-group-item-primary">
                        <div style="display: flex; justify-content: space-between;">
                            <div>Total civilian reprimands:</div>
                            <div>{{ resultsObj.fine_total }}</div>
                        </div>
                    </div>          
                    <div v-if="resultsObj.bonus_total != null" class="list-group-item list-group-item-primary">
                        <div style="display: flex; justify-content: space-between;">
                            <div>Total officer bonuses:</div>
                            <div>{{ resultsObj.bonus_total }}</div>
                        </div>
                    </div>              
                    <div class="list-group-item list-group-item-primary">
                        <div style="display: flex; justify-content: space-between;">
                            <div>Total tokens:</div>
                            <div>{{ resultsObj.defend_token_total }}</div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
                
        
        </div>
        `
}