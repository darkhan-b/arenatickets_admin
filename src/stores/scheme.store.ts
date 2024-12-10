import { defineStore } from 'pinia'
import $axios from '@/api/api.service'
import { useEloquentStore } from '@/stores/eloquent.store'
import { i18n } from '@/services/i18initiator.service'

export const useSchemeStore = defineStore('scheme', {
  state: () => ({
    venue: <any>null,
    scheme: <any>null,
    section: <any>null,
    schemeView: <string>'plan',
    pricegroups: <any[]>[],
    selectedSeats: <any[]>[],
    lastSeat: <any>null
  }),
  getters: {
    seats: (state) => {
      return state.section?.seats || []
    },
    rows() {
      // return []
      const rowsTmp: any = {}
      this.seats.forEach((item: any) => {
        // if(!rowsTmp.hasOwnProperty(item.row)) {
        rowsTmp[item.row] = {
          y: getRowY(item),
          x: getRowX(item),
          title: getRowName(item)
        }
        // }
      })
      return rowsTmp
    },
    maxRow() {
      const rowsArray: number[] = Object.keys(this.rows).map((v) => Number(v))
      return rowsArray.length > 0 ? Math.max(...rowsArray) : 0
    },
    numberOfRows() {
      const rowsArray: number[] = Object.keys(this.rows).map((v) => Number(v))
      return rowsArray.length
    },
    maxW() {
      const seats = this.seats as any[]
      const widths = seats.map((seat: any) => seat.x)
      return Math.max(...widths) + 50
    },
    maxH() {
      const seats = this.seats as any[]
      const heights = seats.map((seat: any) => seat.y)
      return Math.max(...heights) + 100
    },
    withoutTicketAmongSelectedSeats(): any {
      return this.selectedSeats.filter((x: any) => {
        const seat = this.seats.find((s: any) => s.id === x)
        return seat && !seat.ticket
      })
    }
  },
  actions: {
    async loadScheme(id: any) {
      this.scheme = null
      this.venue = null
      try {
        const res = await $axios.get(`/admin/scheme/${id}`)
        this.scheme = res.data
        this.venue = res.data.venue
      } catch (e) {
        console.log(e)
      }
    },
    async saveScheme() {
      try {
        const res = await $axios.post(
          '/admin/scheme/' + this.scheme.id,
          this.scheme
        )
        this.scheme = res.data
        // @ts-ignore
        window.$message.success('Сохранено', {
          closable: true,
          duration: 5000
        })
      } catch (e) {
        console.log(e)
      }
    },
    async deleteSection() {
      try {
        const res = await $axios.delete('/admin/scheme/' + this.section.id)
        this.scheme = res.data
        this.section = null
      } catch (e) {
        console.log(e)
      }
    },
    async getSectionDetails(id: number) {
      const eloquentStore = useEloquentStore()
      try {
        const res = await eloquentStore.getModel(id, 'section')
        this.section = res?.data
        this.scheme = res?.data?.scheme
        this.venue = res?.data?.scheme?.venue
        this.selectedSeats = []
      } catch (e) {
        console.log(e)
      }
    },
    async saveSectionSeats() {
      try {
        const res = await $axios.post(
          `/admin/section/${this.section.id}`,
          this.section
        )
        this.section = res.data
        this.lastSeat = null
        this.selectedSeats = []
      } catch (e) {
        console.log(e)
      }
    },
    async deleteSelectedSeats() {
      try {
        const res = await $axios.post(
          `/admin/section/${this.section.id}/deleteSeats`,
          { seats: this.selectedSeats }
        )
        this.section = res.data
        this.selectedSeats = []
      } catch (e) {
        console.log(e)
      }
    },
    async seatPressed(seat: any) {
      if (!seat.id) return
      const exists = this.selectedSeats.includes(seat.id)
      if (exists) {
        this.selectedSeats = this.selectedSeats.filter(
          (c: any) => c !== seat.id
        )
        this.lastSeat.value = null
      } else {
        this.selectedSeats.push(seat.id)
        this.lastSeat = seat
      }
    },
    schemeUnmount() {
      this.section = null
      this.scheme = null
      this.venue = null
      this.selectedSeats = []
    }
  }
})

const getRowName = (rowItem: any): string => {
  const title = rowItem.row
  if (isNaN(title)) return title
  return `${i18n.t('row')} ${title}`
}

const getRowX = (rowItem: any) => {
  return 0
}
const getRowY = (rowItem: any) => {
  return rowItem.y
}
