<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOfferStore } from '@/stores/offer'
import { useClientStore } from '@/stores/client'
import type {
  Offer, Flight, FlightSegment, Airport, Hotel,
  CarRental, CarRentalVehicle, Cruise, CruiseCabin,
  Excursion, PublicTransport, AdditionalService,
  FlightClass, Currency, TransportCategory,
} from '@/api/types/offer'
import DateField from '@/components/common/DateField.vue'
import DateTimeField from '@/components/common/DateTimeField.vue'
import TimezoneOffsetSelect from '@/components/common/TimezoneOffsetSelect.vue'
import { computeNights, pluralizeNights } from '@/helpers/hotel'

const route = useRoute()
const router = useRouter()
const offerStore = useOfferStore()
const clientStore = useClientStore()

const isEdit = ref(false)
const tourId = ref<string | null>(null)

const CURRENCIES: Currency[] = ['RUB', 'USD', 'EUR', 'TRY']
const FLIGHT_CLASSES: FlightClass[] = ['economy', 'comfort', 'business']
const TRANSPORT_CATEGORIES: TransportCategory[] = ['taxi', 'bus', 'transfer']
const STARS = [1, 2, 3, 4, 5]

function blankAirport(): Airport {
  // Часовой пояс хранится как ISO-смещение от UTC (например, "+03:00", "-05:30").
  // Структура `Airport.timezone` остаётся `string`.
  return { city: '', name: '', code: '', timezone: '+03:00' }
}
function blankSegment(): FlightSegment {
  return {
    airline: '',
    flightNumber: '',
    flightClass: 'economy',
    from: blankAirport(),
    to: blankAirport(),
    departureDateTime: '',
    arrivalDateTime: '',
  }
}
function blankFlight(): Flight {
  return { segments: [blankSegment()], price: 0, currency: 'RUB' }
}
function blankHotel(): Hotel {
  return { name: '', stars: 3, address: '', description: '', roomType: '', occupancyType: '', price: 0, currency: 'RUB', gallery: [], serviceFee: 0, checkIn: '', checkOut: '',}
}
function blankCarRental(): CarRental {
  return { name: '', startLocation: '', endLocation: '', vehicles: [] }
}
function blankVehicle(): CarRentalVehicle {
  return { vehicle: '', name: '', price: 0, currency: 'RUB' }
}
function blankCruise(): Cruise {
  return { gallery: [], name: '', cabin: blankCabin() }
}
function blankCabin(): CruiseCabin {
  return { description: '', price: 0, currency: 'USD' }
}
function blankExcursion(): Excursion {
  return { date: null, city: '', price: 0, name: '', currency: 'RUB', managerComment: '', gallery: [] }
}
function blankTransport(): PublicTransport {
  return { datetime: '', category: 'transfer', pickupLocation: '', dropoffLocation: '', duration: 0, price: 0, currency: 'RUB' }
}
function blankService(): AdditionalService {
  return { name: '', price: 0, currency: 'RUB' }
}

function blankOffer(): Offer {
  return {
    title: '',
    clients: [],
    welcomeText: '',
    startDate: '',
    endDate: '',
    flights: [],
    hotels: [],
    carRentals: [],
    cruises: [],
    excursions: [],
    transport: [],
    additionalServices: [],
  }
}

const offer = reactive<Offer>(blankOffer())

onMounted(async () => {
  // Параллельно подгружаем список клиентов для мультиселекта
  const clientsPromise = clientStore.loadClients()

  const id = route.params.id as string | undefined
  if (id) {
    isEdit.value = true
    tourId.value = id
    await offerStore.loadOfferById(id)
    if (offerStore.currentOffer) {
      Object.assign(offer, JSON.parse(JSON.stringify(offerStore.currentOffer)))
    }
  }

  await clientsPromise
})

// Маппинг между Client[] (как хранится в Offer) и string[] email-ов (значение v-autocomplete)
const selectedClientEmails = computed<string[]>({
  get: () => offer.clients.map((c) => c.email),
  set: (emails) => {
    offer.clients = emails
      .map((e) => clientStore.clients.find((c) => c.email === e))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
  },
})

type DialogType = 'flight' | 'hotel' | 'carRental' | 'cruise' | 'excursion' | 'transport' | 'service' | null
const activeDialog = ref<DialogType>(null)
const editingIndex = ref<number | null>(null)

const draftFlight = ref<Flight>(blankFlight())
const draftHotel = ref<Hotel>(blankHotel())
const draftCarRental = ref<CarRental>(blankCarRental())
const draftCruise = ref<Cruise>(blankCruise())
const draftExcursion = ref<Excursion>(blankExcursion())
const draftTransport = ref<PublicTransport>(blankTransport())
const draftService = ref<AdditionalService>(blankService())

function openAdd(type: DialogType) {
  editingIndex.value = null
  if (type === 'flight') draftFlight.value = blankFlight()
  if (type === 'hotel') draftHotel.value = blankHotel()
  if (type === 'carRental') draftCarRental.value = blankCarRental()
  if (type === 'cruise') draftCruise.value = blankCruise()
  if (type === 'excursion') draftExcursion.value = blankExcursion()
  if (type === 'transport') draftTransport.value = blankTransport()
  if (type === 'service') draftService.value = blankService()
  activeDialog.value = type
}

function openEdit(type: DialogType, index: number) {
  editingIndex.value = index
  if (type === 'flight') draftFlight.value = JSON.parse(JSON.stringify(offer.flights[index]))
  if (type === 'hotel') draftHotel.value = JSON.parse(JSON.stringify(offer.hotels[index]))
  if (type === 'carRental') draftCarRental.value = JSON.parse(JSON.stringify(offer.carRentals[index]))
  if (type === 'cruise') draftCruise.value = JSON.parse(JSON.stringify(offer.cruises[index]))
  if (type === 'excursion') draftExcursion.value = JSON.parse(JSON.stringify(offer.excursions[index]))
  if (type === 'transport') draftTransport.value = JSON.parse(JSON.stringify(offer.transport[index]))
  if (type === 'service') draftService.value = JSON.parse(JSON.stringify(offer.additionalServices[index]))
  activeDialog.value = type
}

function saveDialog() {
  const idx = editingIndex.value
  if (activeDialog.value === 'flight') {
    syncTransferEndpoints()
    if (idx !== null) offer.flights[idx] = JSON.parse(JSON.stringify(draftFlight.value))
    else offer.flights.push(JSON.parse(JSON.stringify(draftFlight.value)))
  }
  if (activeDialog.value === 'hotel') {
    if (idx !== null) offer.hotels[idx] = JSON.parse(JSON.stringify(draftHotel.value))
    else offer.hotels.push(JSON.parse(JSON.stringify(draftHotel.value)))
  }
  if (activeDialog.value === 'carRental') {
    if (idx !== null) offer.carRentals[idx] = JSON.parse(JSON.stringify(draftCarRental.value))
    else offer.carRentals.push(JSON.parse(JSON.stringify(draftCarRental.value)))
  }
  if (activeDialog.value === 'cruise') {
    if (idx !== null) offer.cruises[idx] = JSON.parse(JSON.stringify(draftCruise.value))
    else offer.cruises.push(JSON.parse(JSON.stringify(draftCruise.value)))
  }
  if (activeDialog.value === 'excursion') {
    if (idx !== null) offer.excursions[idx] = JSON.parse(JSON.stringify(draftExcursion.value))
    else offer.excursions.push(JSON.parse(JSON.stringify(draftExcursion.value)))
  }
  if (activeDialog.value === 'transport') {
    if (idx !== null) offer.transport[idx] = JSON.parse(JSON.stringify(draftTransport.value))
    else offer.transport.push(JSON.parse(JSON.stringify(draftTransport.value)))
  }
  if (activeDialog.value === 'service') {
    if (idx !== null) offer.additionalServices[idx] = JSON.parse(JSON.stringify(draftService.value))
    else offer.additionalServices.push(JSON.parse(JSON.stringify(draftService.value)))
  }
  activeDialog.value = null
}

function removeItem(type: DialogType, index: number) {
  if (type === 'flight') offer.flights.splice(index, 1)
  if (type === 'hotel') offer.hotels.splice(index, 1)
  if (type === 'carRental') offer.carRentals.splice(index, 1)
  if (type === 'cruise') offer.cruises.splice(index, 1)
  if (type === 'excursion') offer.excursions.splice(index, 1)
  if (type === 'transport') offer.transport.splice(index, 1)
  if (type === 'service') offer.additionalServices.splice(index, 1)
}

/**
 * Добавляет пересадку. Логика:
 *   - До: segments[..., last { from: A, to: B, ...}]
 *   - После: segments[..., last { from: A, to: TRANSFER }, new { from: TRANSFER, to: B, ... }]
 * Изначально TRANSFER — это копия данных конечной точки B, чтобы пользователь мог
 * затем отредактировать аэропорт пересадки. "Точка прибытия" остаётся прежней.
 */
function addTransfer() {
  console.log(draftFlight.value.segments.length)
  const segs = draftFlight.value.segments
  const lastSeg = segs[segs.length - 1]
  const transferAirport = JSON.parse(JSON.stringify(lastSeg.to)) as Airport
  const finalAirport = JSON.parse(JSON.stringify(lastSeg.to)) as Airport
  const newSeg: FlightSegment = {
    airline: '',
    flightNumber: '',
    flightClass: lastSeg.flightClass,
    from: blankAirport(),
    to: finalAirport,
    departureDateTime: '',
    arrivalDateTime: lastSeg.arrivalDateTime,
  }
  // lastSeg.to теперь представляет аэропорт пересадки (изначально такая же копия,
  // как у newSeg.from, чтобы при сохранении они были синхронизированы).
  segs.push(newSeg)
}

/**
 * Удаляет пересадку с индексом transferIdx (1..N-1). Сегменты i-1 и i сливаются:
 * сохраняем from/airline/flight#/class предыдущего и to/arrivalDateTime следующего.
 */
function removeTransfer(transferIdx: number) {
  const segs = draftFlight.value.segments
  if (transferIdx < 1 || transferIdx >= segs.length) return
  const prev = segs[transferIdx - 1]
  const next = segs[transferIdx]
  prev.to = JSON.parse(JSON.stringify(next.to))
  prev.arrivalDateTime = next.arrivalDateTime
  segs.splice(transferIdx, 1)
}

/**
 * Аэропорт пересадки логически разделяется двумя сегментами: segments[k-1].to и
 * segments[k].from. В UI мы редактируем только segments[k-1].to — перед сохранением
 * мирорим его в segments[k].from, чтобы данные были консистентны.
 */
function syncTransferEndpoints() {
  const segs = draftFlight.value.segments
  for (let k = 1; k < segs.length; k++) {
    segs[k].from = JSON.parse(JSON.stringify(segs[k - 1].to))
  }
}

function addVehicle() { draftCarRental.value.vehicles.push(blankVehicle()) }
function removeVehicle(i: number) { draftCarRental.value.vehicles.splice(i, 1) }

function addCruiseGallery() { draftCruise.value.gallery.push({ url: ''}) }
function removeCruiseGallery(i: number) { draftCruise.value.gallery.splice(i, 1) }
function addHotelImage() { draftHotel.value.gallery.push({ url: '' }) }
function removeHotelImage(i: number) { draftHotel.value.gallery.splice(i, 1) }

async function submitOffer() {
  const data = JSON.parse(JSON.stringify(offer)) as Offer
  if (isEdit.value && tourId.value) {
    const result = await offerStore.updateOffer(tourId.value, data)
    if (result) {
      router.push({ name: 'offer', params: { id: tourId.value } })
    }
  } else {
    const result = await offerStore.createOffer(data)
    if (result?.id) {
      router.push({ name: 'offer', params: { id: result.id } })
    }
  }
}
</script>

<template>
  <v-container class="py-4" max-width="900">

    <!-- Заголовок страницы -->
    <div class="edit-header mb-5">
      <div class="edit-header__icon">
        <v-icon icon="mdi-map-marker-path" size="26" />
      </div>
      <div class="flex-grow-1">
        <h1 class="edit-header__title">{{ isEdit ? 'Редактирование тура' : 'Настройка тура' }}</h1>
      </div>
      <v-btn
        v-if="isEdit && tourId"
        variant="tonal"
        size="default"
        prepend-icon="mdi-eye"
        :to="{ name: 'offer', params: { id: tourId } }"
      >
        Просмотр
      </v-btn>
    </div>

    <v-alert v-if="offerStore.error" type="error" class="mb-3" closable>
      {{ offerStore.error }}
    </v-alert>

    <!-- Единая карточка: основное + секции сущностей -->
    <div class="unified-card mb-4 pa-4">

      <!-- Основная информация -->
      <div class="unified-card__section pb-3">
        <h3 class="mb-4">Основное</h3>
        <v-row dense>
          <v-col cols="12" class="mb-3">
            <v-text-field v-model="offer.title" label="Название тура" density="compact" variant="outlined" hide-details />
          </v-col>
          <v-col cols="12" class="mb-3">
            <v-autocomplete
              v-model="selectedClientEmails"
              :items="clientStore.clients"
              :item-title="(c) => `${c.name} ${c.surname} (${c.email})`"
              item-value="email"
              :loading="clientStore.loading"
              label="Клиенты"
              placeholder="Выберите клиентов, для которых это предложение"
              density="compact"
              variant="outlined"
              hide-details
              multiple
              chips
              closable-chips
              clearable
            >
              <template #chip="{ props: chipProps, item }">
                <v-chip
                  v-bind="chipProps"
                  size="small"
                  variant="tonal"
                >
                  {{ item.raw.name }} {{ item.raw.surname }}
                </v-chip>
              </template>
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps" :title="`${item.raw.name} ${item.raw.surname}`" :subtitle="item.raw.email" />
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="6" class="mb-3">
            <DateField v-model="offer.startDate" label="Дата начала" />
          </v-col>
          <v-col cols="6" class="mb-3">
            <DateField v-model="offer.endDate" label="Дата окончания" :min="offer.startDate" />
          </v-col>
          <v-col cols="12" class="mb-3">
            <v-textarea v-model="offer.welcomeText" label="Приветственный текст" density="compact" variant="outlined" rows="3" hide-details auto-grow />
          </v-col>
        </v-row>
      </div>

      <v-divider class="unified-card__divider" />
      <h3 class="mb-4">Настроить позиции</h3>
      <!-- Секции сущностей -->
      <v-expansion-panels variant="accordion">
        <!-- Перелёты -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center ga-2">
              <v-icon size="18">mdi-airplane</v-icon>
              <span class="text-body-2 font-weight-medium">Перелёты</span>
              <v-chip v-if="offer.flights.length" size="x-small" class="ml-1">{{ offer.flights.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(f, i) in offer.flights" :key="i" class="entity-row">
              <div class="entity-info">
                <span class="text-body-2">{{ i + 1 }}. {{ f.segments[0]?.airline || '—' }}</span>
                <span class="text-caption text-medium-emphasis ml-2">{{ f.segments[0]?.from.city }} → {{ f.segments.at(-1)?.to.city }}</span>
              </div>
              <div class="entity-actions">
                <v-btn icon size="x-small" variant="text" @click="openEdit('flight', i)"><v-icon size="14">mdi-pencil</v-icon></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="removeItem('flight', i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <div class="d-flex align-center ga-3 mt-2">
              <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="openAdd('flight')">Добавить перелёт</v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Отели -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center ga-2">
              <v-icon size="18">mdi-bed</v-icon>
              <span class="text-body-2 font-weight-medium">Отели</span>
              <v-chip v-if="offer.hotels.length" size="x-small" class="ml-1">{{ offer.hotels.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(h, i) in offer.hotels" :key="i" class="entity-row">
              <div class="entity-info">
                <span class="text-body-2">{{ i + 1 }}. {{ h.name || '—' }}</span>
                <span class="text-caption text-medium-emphasis ml-2">{{ h.checkIn }} — {{ h.checkOut }} · {{ pluralizeNights(computeNights(h.checkIn, h.checkOut)) }}</span>
              </div>
              <div class="entity-actions">
                <v-btn icon size="x-small" variant="text" @click="openEdit('hotel', i)"><v-icon size="14">mdi-pencil</v-icon></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="removeItem('hotel', i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <div class="d-flex align-center ga-3 mt-2">
              <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="openAdd('hotel')">Добавить отель</v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Аренда авто -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center ga-2">
              <v-icon size="18">mdi-car</v-icon>
              <span class="text-body-2 font-weight-medium">Аренда авто</span>
              <v-chip v-if="offer.carRentals.length" size="x-small" class="ml-1">{{ offer.carRentals.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(c, i) in offer.carRentals" :key="i" class="entity-row">
              <div class="entity-info">
                <span class="text-body-2">{{ i + 1 }}. {{ c.name || '—' }}</span>
                <span class="text-caption text-medium-emphasis ml-2">{{ c.startLocation }} → {{ c.endLocation }}</span>
              </div>
              <div class="entity-actions">
                <v-btn icon size="x-small" variant="text" @click="openEdit('carRental', i)"><v-icon size="14">mdi-pencil</v-icon></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="removeItem('carRental', i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" class="mt-2" @click="openAdd('carRental')">Добавить аренду</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Круизы -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center ga-2">
              <v-icon size="18">mdi-ferry</v-icon>
              <span class="text-body-2 font-weight-medium">Круизы</span>
              <v-chip v-if="offer.cruises.length" size="x-small" class="ml-1">{{ offer.cruises.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(c, i) in offer.cruises" :key="i" class="entity-row">
              <div class="entity-info">
                <span class="text-body-2">{{ i + 1 }}. {{ c.name || '—' }}</span>
                <span class="text-caption text-medium-emphasis ml-2">{{ c.cabin.description || '—' }}</span>
              </div>
              <div class="entity-actions">
                <v-btn icon size="x-small" variant="text" @click="openEdit('cruise', i)"><v-icon size="14">mdi-pencil</v-icon></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="removeItem('cruise', i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" class="mt-2" @click="openAdd('cruise')">Добавить круиз</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Экскурсии -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center ga-2">
              <v-icon size="18">mdi-camera</v-icon>
              <span class="text-body-2 font-weight-medium">Экскурсии</span>
              <v-chip v-if="offer.excursions.length" size="x-small" class="ml-1">{{ offer.excursions.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(e, i) in offer.excursions" :key="i" class="entity-row">
              <div class="entity-info">
                <span class="text-body-2">{{ i + 1 }}. {{ e.city || '—' }}</span>
                <span class="text-caption text-medium-emphasis ml-2">{{ e.price }} {{ e.currency }}</span>
              </div>
              <div class="entity-actions">
                <v-btn icon size="x-small" variant="text" @click="openEdit('excursion', i)"><v-icon size="14">mdi-pencil</v-icon></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="removeItem('excursion', i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" class="mt-2" @click="openAdd('excursion')">Добавить экскурсию</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Транспорт -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center ga-2">
              <v-icon size="18">mdi-bus</v-icon>
              <span class="text-body-2 font-weight-medium">Транспорт</span>
              <v-chip v-if="offer.transport.length" size="x-small" class="ml-1">{{ offer.transport.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(t, i) in offer.transport" :key="i" class="entity-row">
              <div class="entity-info">
                <span class="text-body-2">{{ i + 1 }}. {{ t.category }}</span>
                <span class="text-caption text-medium-emphasis ml-2">{{ t.pickupLocation }} → {{ t.dropoffLocation }}</span>
              </div>
              <div class="entity-actions">
                <v-btn icon size="x-small" variant="text" @click="openEdit('transport', i)"><v-icon size="14">mdi-pencil</v-icon></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="removeItem('transport', i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" class="mt-2" @click="openAdd('transport')">Добавить транспорт</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Доп. услуги -->
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center ga-2">
              <v-icon size="18">mdi-star-plus</v-icon>
              <span class="text-body-2 font-weight-medium">Доп. услуги</span>
              <v-chip v-if="offer.additionalServices.length" size="x-small" class="ml-1">{{ offer.additionalServices.length }}</v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(s, i) in offer.additionalServices" :key="i" class="entity-row">
              <div class="entity-info">
                <span class="text-body-2">{{ i + 1 }}.  {{ s.name || '—' }}</span>
                <span class="text-caption text-medium-emphasis ml-2">{{ s.price }} {{ s.currency }}</span>
              </div>
              <div class="entity-actions">
                <v-btn icon size="x-small" variant="text" @click="openEdit('service', i)"><v-icon size="14">mdi-pencil</v-icon></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="removeItem('service', i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" class="mt-2" @click="openAdd('service')">Добавить услугу</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- Сохранить -->
    <div class="d-flex justify-end ga-2">
      <v-btn
        elevation="2"
        size="default"
        prepend-icon="mdi-close"
        @click="router.back()"
      >
        Отмена
      </v-btn>
      <v-btn
        elevation="2"
        size="default"
        prepend-icon="mdi-content-save"
        :loading="offerStore.loading"
        @click="submitOffer"
      >
        {{ isEdit ? 'Сохранить изменения' : 'Создать тур' }}
      </v-btn>
    </div>
  </v-container>

  <!-- ДИАЛОГ: ПЕРЕЛЁТ -->
  <v-dialog v-model="activeDialog" :model-value="activeDialog === 'flight'" @update:model-value="v => { if (!v) activeDialog = null }" max-width="700" scrollable>
    <v-card>
      <v-card-title class="dialog-title">
        <v-icon class="mr-2">mdi-airplane</v-icon>
        {{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} перелёт
      </v-card-title>
      <v-divider />
      <v-card-text class="dialog-body">
        <!-- Общие параметры перелёта -->
        <v-row dense>
          <v-col cols="5"><v-text-field v-model.number="draftFlight.price" label="Цена" type="number" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="4"><v-select v-model="draftFlight.currency" :items="CURRENCIES" label="Валюта" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="12">
            <v-textarea v-model="draftFlight.managerComment" label="Комментарий менеджера" density="compact" variant="outlined" rows="2" hide-details auto-grow />
          </v-col>
        </v-row>

        <!-- Точка отправления -->
        <div class="endpoint-card endpoint-card--departure mt-3">
          <div class="endpoint-card__title">
            <v-icon size="16" class="mr-1">mdi-airplane-takeoff</v-icon>
            Точка отправления
          </div>
          <!-- Информация о первом рейсе -->
          <div class="leg-card__title">
            <v-icon size="14" class="mr-1">mdi-airplane</v-icon>
            Рейс
          </div>
          <v-row dense>
            <v-col cols="6"><v-text-field v-model="draftFlight.segments[0].airline" label="Авиакомпания" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="3"><v-text-field v-model="draftFlight.segments[0].flightNumber" label="Рейс" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="3"><v-select v-model="draftFlight.segments[0].flightClass" :items="FLIGHT_CLASSES" label="Класс" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="12"><v-text-field v-model="draftFlight.segments[0].from.city" label="Город" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="8"><v-text-field v-model="draftFlight.segments[0].from.name" label="Аэропорт" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="4"><v-text-field v-model="draftFlight.segments[0].from.code" label="Код" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="6"><TimezoneOffsetSelect v-model="draftFlight.segments[0].from.timezone" /></v-col>
            <v-col cols="6"><DateTimeField v-model="draftFlight.segments[0].departureDateTime" label="Вылет (местное)" /></v-col>
          </v-row>
        </div>

        <!-- Пересадки -->
        <template v-for="k in draftFlight.segments.length - 1" :key="`transfer-${k}`">
          <div class="transfer-card mt-2">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="transfer-card__title">
                <v-icon size="14" class="mr-1">mdi-airplane-clock</v-icon>
                Пересадка {{ k }}
              </div>
              <v-btn icon size="x-small" variant="text" color="error" @click="removeTransfer(k)">
                <v-icon size="14">mdi-delete</v-icon>
              </v-btn>
            </div>

            <v-row dense>
              <v-col cols="12"><v-text-field v-model="draftFlight.segments[k - 1].to.city" label="Город" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="8"><v-text-field v-model="draftFlight.segments[k - 1].to.name" label="Аэропорт" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="4"><v-text-field v-model="draftFlight.segments[k - 1].to.code" label="Код" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="6"><TimezoneOffsetSelect v-model="draftFlight.segments[k - 1].to.timezone" /></v-col>
              <v-col cols="6"><DateTimeField v-model="draftFlight.segments[k - 1].arrivalDateTime" label="Прилёт (местное)" /></v-col>
            </v-row>

            <div class="leg-card__title mt-3">
              <v-icon size="14" class="mr-1">mdi-airplane</v-icon>
              Рейс после пересадки в {{ draftFlight.segments[k - 1].to.city }}
            </div>
            <v-row dense>
              <v-col cols="6"><v-text-field v-model="draftFlight.segments[k].airline" label="Авиакомпания" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="3"><v-text-field v-model="draftFlight.segments[k].flightNumber" label="Рейс" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="3"><v-select v-model="draftFlight.segments[k].flightClass" :items="FLIGHT_CLASSES" label="Класс" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="8"><v-text-field v-model="draftFlight.segments[k].from.name" label="Аэропорт" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="4"><v-text-field v-model="draftFlight.segments[k].from.code" label="Код" density="compact" variant="outlined" hide-details /></v-col>
              <v-col cols="12"><DateTimeField v-model="draftFlight.segments[k].departureDateTime" label="Вылет с пересадки (местное)" /></v-col>
            </v-row>
          </div>
        </template>

        <!-- Кнопка добавления пересадки -->
        <div class="d-flex justify-center mt-3 mb-1">
          <v-btn variant="tonal" prepend-icon="mdi-plus" size="small" @click="addTransfer">
            Добавить пересадку
          </v-btn>
        </div>

        <!-- Точка прибытия -->
        <div class="endpoint-card endpoint-card--arrival mt-2">
          <div class="endpoint-card__title">
            <v-icon size="16" class="mr-1">mdi-airplane-landing</v-icon>
            Точка прибытия
          </div>
          <v-row dense>
            <v-col cols="12"><v-text-field v-model="draftFlight.segments[draftFlight.segments.length - 1].to.city" label="Город" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="8"><v-text-field v-model="draftFlight.segments[draftFlight.segments.length - 1].to.name" label="Аэропорт" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="4"><v-text-field v-model="draftFlight.segments[draftFlight.segments.length - 1].to.code" label="Код" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="6"><TimezoneOffsetSelect v-model="draftFlight.segments[draftFlight.segments.length - 1].to.timezone" /></v-col>
            <v-col cols="6"><DateTimeField v-model="draftFlight.segments[draftFlight.segments.length - 1].arrivalDateTime" label="Прилёт (местное)" /></v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="activeDialog = null">Отмена</v-btn>
        <v-btn variant="tonal" @click="saveDialog">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ДИАЛОГ: ОТЕЛЬ -->
  <v-dialog :model-value="activeDialog === 'hotel'" @update:model-value="v => { if (!v) activeDialog = null }" max-width="650" scrollable>
    <v-card>
      <v-card-title class="dialog-title"><v-icon class="mr-2">mdi-bed</v-icon>{{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} отель</v-card-title>
      <v-divider />
      <v-card-text class="dialog-body">
        <v-row dense>
          <v-col class="mt-2" cols="8"><v-text-field v-model="draftHotel.name" label="Название" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="4"><v-select v-model="draftHotel.stars" :items="STARS" label="Звёзды" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="12"><v-text-field v-model="draftHotel.address" label="Адрес" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="12"><v-textarea v-model="draftHotel.description" label="Описание" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
          <v-col class="mt-2" cols="6"><v-text-field v-model="draftHotel.roomType" label="Тип номера" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="6"><v-text-field v-model="draftHotel.occupancyType" label="Размещение" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="12"><v-textarea v-model="draftHotel.roomDescription" label="Описание номера" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
          <v-col class="mt-2" cols="6"><DateField v-model="draftHotel.checkIn" label="Заезд" /></v-col>
          <v-col class="mt-2" cols="6"><DateField v-model="draftHotel.checkOut" label="Выезд" :min="draftHotel.checkIn" /></v-col>
          <v-col class="mt-2" cols="6"><v-text-field v-model.number="draftHotel.price" label="Цена" type="number" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="6"><v-select v-model="draftHotel.currency" :items="CURRENCIES" label="Валюта" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="6"><v-text-field v-model.number="draftHotel.serviceFee" label="Сервисный сбор" type="number" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="6"><v-select v-model="draftHotel.serviceFeeCurrency" :items="CURRENCIES" label="Валюта сбора" density="compact" variant="outlined" hide-details /></v-col>
          <v-col class="mt-2" cols="12"><v-textarea v-model="draftHotel.managerComment" label="Комментарий менеджера" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
        </v-row>
        <div class="text-caption font-weight-medium mt-3 mb-1">Фотографии</div>
        <div v-for="(img, i) in draftHotel.gallery" :key="i" class="d-flex align-center ga-2 mb-1">
          <div class="image-preview" :class="{ 'image-preview--empty': !img.url }">
            <img v-if="img.url" :src="img.url" alt="превью" @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />
            <v-icon v-else size="20" color="rgba(255,255,255,.35)">mdi-image-outline</v-icon>
          </div>
          <v-text-field v-model="img.url" label="URL фото" density="compact" variant="outlined" hide-details class="flex-grow-1" />
          <v-btn icon size="x-small" variant="text" color="error" @click="removeHotelImage(i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
        </div>
        <v-btn size="x-small" variant="text" prepend-icon="mdi-plus" @click="addHotelImage">Добавить фото</v-btn>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="activeDialog = null">Отмена</v-btn>
        <v-btn variant="tonal" @click="saveDialog">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ДИАЛОГ: АРЕНДА АВТО -->
  <v-dialog :model-value="activeDialog === 'carRental'" @update:model-value="v => { if (!v) activeDialog = null }" max-width="600" scrollable>
    <v-card>
      <v-card-title class="dialog-title"><v-icon class="mr-2">mdi-car</v-icon>{{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} аренду авто</v-card-title>
      <v-divider />
      <v-card-text class="dialog-body">
        <v-row dense>
          <v-col cols="12"><v-text-field v-model="draftCarRental.name" label="Название компании" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><v-text-field v-model="draftCarRental.startLocation" label="Место получения" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><v-text-field v-model="draftCarRental.endLocation" label="Место сдачи" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="12"><v-textarea v-model="draftCarRental.managerComment" label="Комментарий менеджера" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
        </v-row>
        <div class="text-caption font-weight-medium mt-3 mb-1">Автомобили</div>
        <div v-for="(v, i) in draftCarRental.vehicles" :key="i" class="mb-2 pa-2 rounded" style="border:1px solid rgba(255,255,255,.12)">
          <v-row dense>
            <v-col cols="5"><v-text-field v-model="v.vehicle" label="Тип авто" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="5"><v-text-field v-model="v.name" label="Модель" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="2" class="d-flex align-center justify-end">
              <v-btn icon size="x-small" variant="text" color="error" @click="removeVehicle(i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
            </v-col>
            <v-col cols="6"><v-text-field v-model.number="v.price" label="Цена" type="number" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="6"><v-select v-model="v.currency" :items="CURRENCIES" label="Валюта" density="compact" variant="outlined" hide-details /></v-col>
          </v-row>
        </div>
        <v-btn size="x-small" variant="text" prepend-icon="mdi-plus" @click="addVehicle">Добавить авто</v-btn>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="activeDialog = null">Отмена</v-btn>
        <v-btn variant="tonal" @click="saveDialog">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ДИАЛОГ: КРУИЗ -->
  <v-dialog :model-value="activeDialog === 'cruise'" @update:model-value="v => { if (!v) activeDialog = null }" max-width="600" scrollable>
    <v-card>
      <v-card-title class="dialog-title"><v-icon class="mr-2">mdi-ferry</v-icon>{{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} круиз</v-card-title>
      <v-divider />
      <v-card-text class="dialog-body">
        <v-row dense>
          <v-col cols="12"><v-text-field v-model="draftCruise.name" label="Название круиза" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="12"><v-textarea v-model="draftCruise.managerComment" label="Комментарий менеджера" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
        </v-row>
        <div class="text-caption font-weight-medium mt-3 mb-1">Каюта</div>
        <div class="mb-2 pa-2 rounded" style="border:1px solid rgba(255,255,255,.12)">
          <v-row dense>
            <v-col cols="12"><v-text-field v-model="draftCruise.cabin.description" label="Описание каюты" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="6"><v-text-field v-model.number="draftCruise.cabin.price" label="Цена" type="number" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="6"><v-select v-model="draftCruise.cabin.currency" :items="CURRENCIES" label="Валюта" density="compact" variant="outlined" hide-details /></v-col>
            <v-col cols="12"><v-textarea v-model="draftCruise.cabin.managerComment" label="Комментарий менеджера (каюта)" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
          </v-row>
        </div>
        <div class="text-caption font-weight-medium mt-3 mb-1">Галерея (URL)</div>
        <div v-for="(_url, i) in draftCruise.gallery" :key="i" class="d-flex align-center ga-2 mb-1">
          <div class="image-preview" :class="{ 'image-preview--empty': !draftCruise.gallery[i].url }">
            <img v-if="draftCruise.gallery[i].url" :src="draftCruise.gallery[i].url" alt="превью" @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />
            <v-icon v-else size="20" color="rgba(255,255,255,.35)">mdi-image-outline</v-icon>
          </div>
          <v-text-field v-model="draftCruise.gallery[i].url" label="URL" density="compact" variant="outlined" hide-details class="flex-grow-1" />
          <v-btn icon size="x-small" variant="text" color="error" @click="removeCruiseGallery(i)"><v-icon size="14">mdi-delete</v-icon></v-btn>
        </div>
        <v-btn size="x-small" variant="text" prepend-icon="mdi-plus" @click="addCruiseGallery">Добавить фото</v-btn>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="activeDialog = null">Отмена</v-btn>
        <v-btn variant="tonal" @click="saveDialog">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ДИАЛОГ: ЭКСКУРСИЯ -->
  <v-dialog :model-value="activeDialog === 'excursion'" @update:model-value="v => { if (!v) activeDialog = null }" max-width="500" scrollable>
    <v-card>
      <v-card-title class="dialog-title"><v-icon class="mr-2">mdi-camera</v-icon>{{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} экскурсию</v-card-title>
      <v-divider />
      <v-card-text class="dialog-body">
        <v-row dense>
          <v-col cols="12"><v-text-field v-model="draftExcursion.name" label="Название" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><v-text-field v-model="draftExcursion.city" label="Город" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><DateField :model-value="(draftExcursion.date as unknown as string) ?? ''" @update:model-value="(v) => (draftExcursion.date = v as unknown as Date)" label="Дата" /></v-col>
          <v-col cols="6"><v-text-field v-model.number="draftExcursion.price" label="Цена" type="number" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><v-select v-model="draftExcursion.currency" :items="CURRENCIES" label="Валюта" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="12"><v-textarea v-model="draftExcursion.managerComment" label="Комментарий менеджера" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
        </v-row>
        <div class="text-caption font-weight-medium mt-3 mb-1">Галерея</div>
        <div v-for="(img, i) in draftExcursion.gallery" :key="i" class="d-flex align-center ga-2 mb-1">
          <div class="image-preview" :class="{ 'image-preview--empty': !img.url }">
            <img v-if="img.url" :src="img.url" alt="превью" @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />
            <v-icon v-else size="20" color="rgba(255,255,255,.35)">mdi-image-outline</v-icon>
          </div>
          <v-text-field v-model="img.url" label="URL" density="compact" variant="outlined" hide-details class="flex-grow-1" />
          <v-btn icon size="x-small" variant="text" color="error" @click="draftExcursion.gallery.splice(i,1)"><v-icon size="14">mdi-delete</v-icon></v-btn>
        </div>
        <v-btn size="x-small" variant="text" prepend-icon="mdi-plus" @click="draftExcursion.gallery.push({ url: '' })">Добавить фото</v-btn>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="activeDialog = null">Отмена</v-btn>
        <v-btn variant="tonal" @click="saveDialog">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ДИАЛОГ: ТРАНСПОРТ -->
  <v-dialog :model-value="activeDialog === 'transport'" @update:model-value="v => { if (!v) activeDialog = null }" max-width="500" scrollable>
    <v-card>
      <v-card-title class="dialog-title"><v-icon class="mr-2">mdi-bus</v-icon>{{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} транспорт</v-card-title>
      <v-divider />
      <v-card-text class="dialog-body">
        <v-row dense>
          <v-col cols="6"><v-select v-model="draftTransport.category" :items="TRANSPORT_CATEGORIES" label="Тип" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><DateTimeField v-model="draftTransport.datetime" label="Дата и время" /></v-col>
          <v-col cols="6"><v-text-field v-model="draftTransport.pickupLocation" label="Место посадки" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><v-text-field v-model="draftTransport.dropoffLocation" label="Место высадки" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="4"><v-text-field v-model.number="draftTransport.duration" label="Длит. (мин)" type="number" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="4"><v-text-field v-model.number="draftTransport.price" label="Цена" type="number" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="4"><v-select v-model="draftTransport.currency" :items="CURRENCIES" label="Валюта" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="12"><v-textarea v-model="draftTransport.managerComment" label="Комментарий менеджера" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="activeDialog = null">Отмена</v-btn>
        <v-btn variant="tonal" @click="saveDialog">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ДИАЛОГ: ДОП. УСЛУГА -->
  <v-dialog :model-value="activeDialog === 'service'" @update:model-value="v => { if (!v) activeDialog = null }" max-width="420" scrollable>
    <v-card>
      <v-card-title class="dialog-title"><v-icon class="mr-2">mdi-star-plus</v-icon>{{ editingIndex !== null ? 'Редактировать' : 'Добавить' }} услугу</v-card-title>
      <v-divider />
      <v-card-text class="dialog-body">
        <v-row dense>
          <v-col cols="12"><v-text-field v-model="draftService.name" label="Название" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><v-text-field v-model.number="draftService.price" label="Цена" type="number" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="6"><v-select v-model="draftService.currency" :items="CURRENCIES" label="Валюта" density="compact" variant="outlined" hide-details /></v-col>
          <v-col cols="12"><v-textarea v-model="draftService.managerComment" label="Комментарий менеджера" density="compact" variant="outlined" rows="2" hide-details auto-grow /></v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-3 ga-2">
        <v-spacer />
        <v-btn variant="text" @click="activeDialog = null">Отмена</v-btn>
        <v-btn variant="tonal" @click="saveDialog">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
@use '@/assets/variables.scss' as variables;

// ─── Edit Header ─────────────────────────────────────────────────────────────
.edit-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  &__icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  &__title {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin: 0;
  }
}

// ─── Unified form card ────────────────────────────────────────────────────────
.unified-card {
  background: rgba(0, 22, 21, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  overflow: hidden;

  &__divider {
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
}

.section-label {
  font-size: 0.7rem !important;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

:deep(.v-field__input),
:deep(.v-field-label),
:deep(.v-label),
:deep(.v-messages__message),
:deep(.v-select__selection-text),
:deep(.v-expansion-panel-title__overlay),
:deep(.v-chip__content) {
  font-size: 0.875rem !important;
}

:deep(.v-expansion-panel-title) {
  font-size: 0.875rem !important;
  min-height: 44px !important;
}

:deep(.v-btn__content) {
  font-size: 0.8125rem !important;
}

.entity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 2px;
  background: rgba(255,255,255,.04);
}
.entity-info {
  display: flex;
  align-items: center;
  overflow: hidden;
  min-width: 0;
}
.entity-info span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.entity-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}
.dialog-title {
  font-size: 1rem !important;
  font-weight: 600;
  padding: 12px 16px !important;
  display: flex;
  align-items: center;
}
.dialog-body {
  padding: 16px !important;
}
// ─── Карточки секций диалога перелёта ───────────────────────────────────────
.endpoint-card,
.leg-card,
.transfer-card {
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);

  &__title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    text-transform: uppercase;
  }
}

.endpoint-card {
  border-color: rgba(54, 170, 184, 0.32);
  background: rgba(54, 170, 184, 0.06);

  &--departure &__title,
  &--arrival &__title {
    color: rgba(54, 170, 184, 0.95);
  }
}

.leg-card {
  background: rgba(255, 255, 255, 0.025);
  border-style: dashed;
  border-color: rgba(255, 255, 255, 0.18);

  &__title {
    color: rgba(255, 255, 255, 0.65);
    text-transform: none;
    letter-spacing: 0;
    font-weight: 500;
  }
}

.transfer-card {
  border-color: rgba(239, 159, 59, 0.35);
  background: rgba(239, 159, 59, 0.05);

  &__title {
    color: rgba(239, 159, 59, 0.95);
  }
}

// ─── Превью изображения рядом с полем URL ────────────────────────────────────
.image-preview {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &--empty {
    background: rgba(255, 255, 255, 0.03);
    border-style: dashed;
  }
}
</style>
