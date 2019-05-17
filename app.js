const dateFormat = { long: "dddd, MMMM D, YYYY [at] h:mm a", short: "dddd, MMMM D, YYYY" }
const SERVER     = "http://10.51.135.136:4000"

Vue.config.devtools = true // DISABLE THIS IN PRODUCTION
Vue.use(SemanticUIVue)

Vue.prototype.$dateFormat = dateFormat

const getDefaultState = () => ({
  isLoading        : true,
  programs         : [],
  filteredPrograms : [],
  roomOptions      : [],
  dayOptions       : [],
  startOptions     : [],
  areaOptions      : [],
  ageOptions       : [],
  searchTitle      : "",
  searchRoom       : null,
  searchDay        : null,
  searchStart      : null,
  searchArea       : null,
  searchAge        : null,
})

const store = new Vuex.Store({
  // state
  state : getDefaultState(),
  // mutations
  mutations : {
    SET_IS_LOADING(state, payload) {
      state.isLoading = payload
    },
    SET_PROGRAMS(state, programs) {
      state.programs = programs
    },
    // DROPDOWN OPTIONS
    SET_ROOM_OPTIONS(state, roomOptions) {
      state.roomOptions = roomOptions
    },
    SET_DAY_OPTIONS(state, dayOptions) {
      state.dayOptions = dayOptions
    },
    SET_START_OPTIONS(state, startOptions) {
      state.startOptions = startOptions
    },
    SET_AREA_OPTIONS(state, areaOptions) {
      state.areaOptions = areaOptions
    },
    SET_AGE_OPTIONS(state, ageOptions) {
      state.ageOptions = ageOptions
    },
    // SEARCH
    SET_SEARCH_TITLE(state, query) {
      state.searchTitle = query
    },
    SET_SEARCH_ROOM(state, query) {
      state.searchRoom = query
    },
    SET_SEARCH_DAY(state, query) {
      state.searchDay = query
    },
    SET_SEARCH_START(state, query) {
      state.searchStart = query
    },
    SET_SEARCH_AREA(state, query) {
      state.searchArea = query
    },
    SET_SEARCH_AGE(state, query) {
      state.searchAge = query
    },
    // FILTER
    FILTER(state) {
      state.filteredPrograms = state.programs
      
      if (state.searchTitle != null || state.searchTitle != "")
        state.filteredPrograms = state.filteredPrograms.filter(program => program.title.toLowerCase().indexOf(state.searchTitle.toLowerCase()) > - 1)
      
      if (state.searchRoom != null)
        state.filteredPrograms = state.filteredPrograms.filter(program => program.room.indexOf(state.searchRoom) > - 1)
      
      if (state.searchDay != null)
        state.filteredPrograms = state.filteredPrograms.filter(program => program.day.indexOf(state.searchDay) > - 1)

      if (state.searchStart != null)
        state.filteredPrograms = state.filteredPrograms.filter(program => program.start.indexOf(state.searchStart) > -1)

      if (state.searchArea != null)
        state.filteredPrograms = state.filteredPrograms.filter(program => program.area.indexOf(state.searchArea) > -1)

      if (state.searchAge != null)
        state.filteredPrograms = state.filteredPrograms.filter(program => program.age.indexOf(state.searchAge) > -1)
    }
  },
  // getters
  getters : {
    isLoading        : state => state.isLoading,
    programs         : state => state.programs,
    filteredPrograms : state => state.filteredPrograms,
    // Dropdown options
    roomOptions      : state => state.roomOptions,
    dayOptions       : state => state.dayOptions,
    startOptions     : state => state.startOptions,
    areaOptions      : state => state.areaOptions,
    ageOptions       : state => state.ageOptions,
    // Search Parameters
    searchTitle      : state => state.searchTitle,
    searchRoom       : state => state.searchRoom,
    searchDay        : state => state.searchDay,
    searchStart      : state => state.searchStart,
    searchArea       : state => state.searchArea,
    searchAge        : state => state.searchAge,
  },
  // actions
  actions : {
    setIsLoading(context, payload) {
      context.commit("SET_IS_LOADING", payload)
    },
    async fetchData(context) {
      try {
        const response = await axios.get("data.json")
        let programs   = response.data
        
        let roomOptions = [], dayOptions = [], startOptions = [], areaOptions = [], ageOptions = []

        programs.forEach(((program, i) => {
          program.id = i + 1
          if (program.room != "")
            roomOptions.push(program.room)
          if (program.day != "")
            dayOptions.push(program.day)
          if (program.start != "")
            startOptions.push(program.start)
          if (program.area != "")
            areaOptions.push(program.area)
          if (program.age != "")
            ageOptions.push(program.age)
        }))

        // Get unique room titles and push into array and state
        roomOptions = roomOptions.filter((room, i) => roomOptions.indexOf(room) == i)
                                 .map((room, i) => ({ key   : i, text  : room, value : room }))

        context.commit("SET_ROOM_OPTIONS", roomOptions)
        // Get unique days and push it into array and state
        dayOptions = dayOptions.filter((day, i) => dayOptions.indexOf(day) == i)
                               .map((day, i) => ({ key: i, text: day, value: day }))

        context.commit("SET_DAY_OPTIONS", dayOptions)
        // Get unique start times and push it into array and state
        startOptions = startOptions.filter((start, i) => startOptions.indexOf(start) == i)
                                   .map((start, i) => ({ key: i, text: start, value: start }))

        context.commit("SET_START_OPTIONS", startOptions)
        // Get unique areas and push it into array and state
        areaOptions = areaOptions.filter((area, i) => areaOptions.indexOf(area) == i)
                                 .map((area, i) => ({ key: i, text: area, value: area }))

        context.commit("SET_AREA_OPTIONS", areaOptions)

        // Get unique ages and push it into array and state
        ageOptions = ageOptions.filter((age, i) => ageOptions.indexOf(age) == i)
                               .map((age, i) => ({ key: i, text: age, value: age }))

        context.commit("SET_AGE_OPTIONS", ageOptions)
        // Set state with programs
        context.commit("SET_PROGRAMS", programs)
        
      } catch (error) {
        alert(`Unable to fetch programs: ${error.message}`)
      }
    },
    setSearchTitle(context, query) {
      context.commit("SET_SEARCH_TITLE", query)
      context.commit("FILTER")
    },
    setSearchRoom(context, query) {
      context.commit("SET_SEARCH_ROOM", query)
      context.commit("FILTER")
    },
    setSearchDay(context, query) {
      context.commit("SET_SEARCH_DAY", query)
      context.commit("FILTER")
    },
    setSearchStart(context, query) {
      context.commit("SET_SEARCH_START", query)
      context.commit("FILTER")
    },
    setSearchArea(context, query) {
      context.commit("SET_SEARCH_AREA", query)
      context.commit("FILTER")
    },
    setSearchAge(context, query) {
      context.commit("SET_SEARCH_AGE", query)
      context.commit("FILTER")
    }
  }
})

const Index = Vue.component("index", {
  template : "#index",
  computed : {
    isLoading: {
      set(value) { this.$store.dispatch("setIsLoading", value) },
      get()      { return this.$store.getters.isLoading        },
    },
    programs()     {
      if (this.searchTitle || this.searchRoom || this.searchDay || this.searchStart || this.searchArea || this.searchAge) 
        return this.$store.getters.filteredPrograms
      else
        return this.$store.getters.programs
    },
    roomOptions()  { return this.$store.getters.roomOptions  },
    dayOptions()   { return this.$store.getters.dayOptions   },
    startOptions() { return this.$store.getters.startOptions },
    areaOptions()  { return this.$store.getters.areaOptions  },
    ageOptions()   { return this.$store.getters.ageOptions   },
    searchTitle: {
      set(query) { this.$store.dispatch("setSearchTitle", query) },
      get()      { return this.$store.getters.searchTitle }
    },
    searchRoom: {
      set(query) { this.$store.dispatch("setSearchRoom", query) },
      get()      { return this.$store.getters.searchRoom }
    },
    searchDay: {
      set(query) { this.$store.dispatch("setSearchDay", query) },
      get()      { return this.$store.getters.searchDay }
    },
    searchStart: {
      set(query) { this.$store.dispatch("setSearchStart", query) },
      get()      { return this.$store.getters.searchStart }
    },
    searchArea: {
      set(query) { this.$store.dispatch("setSearchArea", query) },
      get()      { return this.$store.getters.searchArea }
    },
    searchAge: {
      set(query) { this.$store.dispatch("setSearchAge", query) },
      get()      { return this.$store.getters.searchAge }
    }
  },
  async mounted() { 
    await this.$store.dispatch("fetchData") 
    this.isLoading = await false
  }
})

const Show = Vue.component("show", {
  template: "#show",
})

// Routes
const routes = [
  { path: "/",             title: "index", component: Index },
  { path: "/program/{id}", title:"show",   component: Show  },
]

// Route
const router = new VueRouter({ routes })

const app = new Vue({
  store,
  router,
}).$mount("#app")