<template>
    <div class="container-fluid page-body-wrapper">
      <div class="main-panel">
        <div class="content-wrapper">
          <div class="row">
            <div class="col-lg-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <p class="card-title float-left"><i class="mdi mdi-format-list-bulleted menu-icon"></i></p>
                  <p class="card-description float-right">
                    <b-button variant="success" v-b-modal.modalDailyScrum v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i>Add activity</b-button>
                  </p>
                  <div class="table-responsive">
                    <div class="table-responsive">
                <b-table striped hover :items="daily" :fields="fields">
                  <template v-slot:cell(role)="data">
                    <b-badge variant="warning">{{ data.item.team }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button size="sm" variant="danger" v-on:click="Drop(data.item.id)" v-b-modal.modalDailyScrum><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>&nbsp;
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination">
                </b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal 
      id="modalDailyScrum"
      @ok="Save"
    >
      <template v-slot:modal-title>
        Add activity
      </template>
        <form ref="form">
          <div class="form-group">
             <label for="id_users" class="col-form-label">Your Team</label>
            <select class="form-control" name="team" id="team" placeholder="BEON" v-model="team">
           <option value="BEON" checked>BEON</option>
                      <option value="DDS">DDS</option>
                      <option value="DOT">DOT</option>
                      <option value="node1">Node 1</option>
                      <option value="node2">Node 2</option>
                      <option value="react1">React 1</option>
                      <option value="react2">React 2</option>
                      <option value="laravel">Laravel</option>
                      <option value="laravel_vue">Laravel & Vue</option>
                      <option value="android">Android</option>
            </select>
          </div>
           <div class="form-group">
             <label for="activity_yesterday" class="col-form-label">Yesterday Activity</label>
            <input type="text" name="activity_yesterday" class="form-control" rows="7" cols="10" id="activity_yesterday"  v-model="activity_yesterday">
          </div>
          <div class="form-group">
             <label for="activity_today" class="col-form-label">Today Activity</label>
            <input type="text" name="activity_today" class="form-control" rows="7" cols="10" id="activity_today"  v-model="activity_today">
          </div>
           <div class="form-group">
             <label for="problem_yesterday" class="col-form-label">Yesterday Problem</label>
            <input type="text" name="problem_yesterday" class="form-control" rows="7" cols="10" id="problem_yesterday"  v-model="problem_yesterday">
          </div>
           <div class="form-group">
             <label for="solution" class="col-form-label">Your Solution</label>
            <input type="text" name="solution" class="form-control" rows="7" cols="10" id="solution"  v-model="solution">
          </div>
        </form>
    </b-modal>
</div>
  </div>
  </div>
</template>


     

<script>

module.exports = {
  data : function(){
    return {
      search: "",
      id: "",
      team: "",
      activity_yesterday: "",
      activity_today: "",
      problem_yesterday: "",
      solution: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      daily: [],
      fields: [ "team", "Activity_yesterday", "Activity_today", "Problem_yesterday", "Solution", "Action"], //ngelink ke navbar table bawah pcc
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/daily/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.status == 1){
          this.$bvToast.hide("loadingToast");
          this.daily = response.data.daily;
          this.rows = response.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data daily."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },

    Add : function(){
      this.action = "insert";
      this.id = "";
      this.team = "";
      this.activity_yesterday = "";
      this.activity_today = "";
      this.problem_yesterday = "";
      this.solution = "";
    },

    // Edit : function(item){
    //   this.action = "update";
    //   this.id = item.id;
    //   this.team = item.team;
    //   this.activity_yesterday = item.activity_yesterday;
    //   this.activity_today = item.activity_today;
    // },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id", this.id);
        form.append("team", this.team);
        form.append("activity_yesterday", this.activity_yesterday);
        form.append("activity_today", this.activity_today);
        form.append("problem_yesterday", this.problem_yesterday);
        form.append("solution", this.solution);

        this.axios.post("/daily", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        let form = {
          team: this.team,
          activity_yesterday: this.activity_yesterday,
          activity_today: this.activity_today,
          problem_yesterday: this.problem_yesterday,
          solution: this.solution,
        }
        this.axios.put("/daily/" + this.id, form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/daily/" + id, conf)
        .then(response => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();
  }
}
</script>