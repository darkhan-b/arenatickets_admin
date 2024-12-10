import { defineStore } from 'pinia'
import $axios from '@/api/api.service'
import { useSchemeStore } from '@/stores/scheme.store'

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    price: <number | null>null,
    amountOfEnterTickets: <number | null>null,
    sectionType: <string>'seats',
    timetable: <any>null,
    tickets: <any>{},
    ticketsCnt: <any>{},
    selectedType: <boolean>false,
    prices: <any[]>[],
    pricegroups: <any[]>[],
    closedSections: <any[]>[],
    sectionsWithoutSeatSelections: <any[]>[],
    changeType: <boolean>true
  }),
  getters: {
    ticketsCount: (state) => {
      return Object.keys(state.tickets).length
    },
    show: (state) => {
      return state.timetable.show
    },
    invitationsToBeCreated: (state) => {
      const schemeStore = useSchemeStore()
      return state.sectionType === 'seats'
        ? schemeStore.withoutTicketAmongSelectedSeats.length
        : state.amountOfEnterTickets
    },
    isSectionClosed: (state) => {
      const schemeStore = useSchemeStore()
      if (!schemeStore.section) return false
      return !!state.closedSections.find(
        (x) => x.section_id === schemeStore.section.id
      )
    },
    isSectionProhibitedForSeatSelection: (state) => {
      const schemeStore = useSchemeStore()
      if (!schemeStore.section) return false
      return !!state.sectionsWithoutSeatSelections.find(
        (x) => x.section_id === schemeStore.section.id
      )
    }
  },
  actions: {
    async loadTimetable(timetableId: number) {
      const schemeStore = useSchemeStore()
      schemeStore.scheme = null
      schemeStore.venue = null
      try {
        const res = await $axios.get(`/admin/timetable/${timetableId}`)
        this.timetable = res.data.timetable
        schemeStore.scheme = res.data.scheme
        schemeStore.venue = res.data.venue
        this.tickets = Array.isArray(res.data.tickets) ? {} : res.data.tickets
        this.ticketsCnt = Array.isArray(res.data.tickets)
          ? {}
          : res.data.tickets
        this.closedSections = res.data.closedSections
        this.sectionsWithoutSeatSelections =
          res.data.sectionsWithoutSeatSelections
      } catch (e) {
        console.log(e)
      }
    },
    async loadSection(groupId: number | null) {
      if (!groupId) return
      try {
        const res = await $axios.get(
          `/admin/timetable/${this.timetable.id}/group/${groupId}`
        )
        this.processSectionData(res.data)
      } catch (e) {
        console.log(e)
      }
    },
    async saveTickets(
      { groupId, comment, invitationOrder, hidePrice } = {
        groupId: null,
        comment: '',
        invitationOrder: false,
        hidePrice: false
      }
    ) {
      if (!groupId) return
      if (invitationOrder) {
        const res = confirm(
          `Будет создано ${this.invitationsToBeCreated} билетов, которые будут оформлены как пригласительные, продолжить?`
        )
        if (!res) return
      }
      const schemeStore = useSchemeStore()
      const res = await $axios.post(
        `/admin/timetable/${this.timetable.id}/group/${groupId}/tickets`,
        {
          type: this.sectionType,
          amount: this.amountOfEnterTickets,
          price: this.price,
          seats: schemeStore.selectedSeats,
          comment: comment,
          invitationOrder,
          hidePrice
        }
      )
      if (res.data && invitationOrder) {
        window.location = res.data.ticketsLink
        return
      }
      this.processSectionData(res.data)
    },
    async deleteTickets() {
      const schemeStore = useSchemeStore()
      const res = await $axios.post(
        `/admin/timetable/${this.timetable.id}/group/${schemeStore.section.id}/tickets/delete`,
        {
          seats: schemeStore.selectedSeats
        }
      )
      this.processSectionData(res.data)
    },
    async closeSectionToggle(val: boolean) {
      const schemeStore = useSchemeStore()
      if (!schemeStore.section.id) return
      const res = await $axios.post(
        `/admin/timetable/${this.timetable.id}/section/${
          schemeStore.section.id
        }/toggle/${val ? 1 : 0}`
      )
      this.closedSections = res.data
    },
    async seatSelectionSectionToggle(val: boolean) {
      const schemeStore = useSchemeStore()
      if (!schemeStore.section.id) return
      const res = await $axios.post(
        `/admin/timetable/${this.timetable.id}/section/${
          schemeStore.section.id
        }/toggleSeatSelection/${val ? 1 : 0}`
      )
      this.sectionsWithoutSeatSelections = res.data
    },
    processSectionData(data: any) {
      const schemeStore = useSchemeStore()
      this.tickets = data.tickets
      schemeStore.selectedSeats = []
      schemeStore.section.seats = data.seats
      this.amountOfEnterTickets = null
      this.price = null
      if (this.tickets.length > 0) {
        this.changeType = false
        const ticket = this.tickets[0]
        this.sectionType = ticket.seat_id ? 'seats' : 'enter'
        if (this.sectionType === 'enter') {
          this.amountOfEnterTickets = this.tickets.length
          this.price = ticket.price
        }
      } else {
        this.changeType = true
      }
      this.prices = data.prices
    },
    async loadPricegroups(timetableId = null) {
      const res = await $axios.get(
        `/admin/timetable/${timetableId || this.timetable.id}/pricegroups`
      )
      this.pricegroups = res.data
    },
    async savePricegroup(
      pricegroup: any,
      comment: string = '',
      invitationOrder = false,
      hidePrice = false
    ) {
      if (invitationOrder) {
        const conf = confirm(
          `Будет создано ${pricegroup.amount} билетов, которые будут оформлены как пригласительные, продолжить?`
        )
        if (!conf) return false
      }
      const pricegroupData = { ...pricegroup }
      pricegroupData.sections = pricegroupData.sections.map(
        (section: any) => section.id
      )
      const res = await $axios.post(
        `/admin/timetable/${this.timetable.id}/pricegroups`,
        {
          ...pricegroupData,
          invitationOrder,
          hidePrice,
          comment
        }
      )
      if (res && invitationOrder) {
        window.location = res.data.ticketsLink
        return true
      }
      this.pricegroups = res.data
      return true
    },
    async deletePricegroup(pricegroup: any, index: number) {
      if (pricegroup.id) {
        const res = await $axios.delete(
          `/admin/timetable/${this.timetable.id}/pricegroups/${pricegroup.id}`
        )
        this.pricegroups = res.data
      }
      if (!pricegroup.id) this.pricegroups.splice(index, 1)
    }
  }
})
