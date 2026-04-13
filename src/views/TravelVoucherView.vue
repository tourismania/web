<script lang="ts">
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'TravelVoucherView',
  setup: function () {

    const tab = ref(null);

    return { tab }
  }

})
</script>

<template>
  <main>
    <div class="main__travel-voucher">
      <div class="main__travel-voucher__header">
        <h1>Информация о путевке</h1>
      </div>
      <div class="main__travel-voucher__body">

        <v-card style="background: transparent">
          <v-tabs
              v-model="tab"
          >
            <v-tab value="one">Маршрутный лист с ценами</v-tab>
            <v-tab value="two">Программа Нью-Йорк</v-tab>
            <v-tab value="three">Программа Орландо</v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="one">
                <div class="main__travel-voucher__body__routes">
                  <h2>Маршрутный лист с ценами</h2>
                  <h3>Перелет</h3>
                  <v-table theme="dark">
                    <thead>
                    <tr>
                      <th class="text-left">Перевозчик</th>
                      <th class="text-left">Рейс №</th>
                      <th class="text-left">Дата</th>
                      <th class="text-left">Вылет</th>
                      <th class="text-left">Время отправления</th>
                      <th class="text-left">Время в пути</th>
                      <th class="text-left">Время прибытия</th>
                      <th class="text-left">Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-left">
                      <td>Ural Airlines</td>
                      <td>U6 773</td>
                      <td>26.09.2025</td>
                      <td>Екатеринбург (Кольцово) - Стамбул (ISTANBUL AIRPORT)</td>
                      <td>07:20</td>
                      <td>5 ч 25 мин</td>
                      <td>10:45</td>
                      <td>129 692,00 ₽</td>
                    </tr>
                    <tr class="text-left">
                      <td>Turkish Airlines</td>
                      <td>TK 11</td>
                      <td>27.09.2025</td>
                      <td>Стамбул (ISTANBUL AIRPORT) - Нью-Йорк (Джон Ф. Кеннеди)</td>
                      <td>18:45</td>
                      <td>10 ч 55 мин</td>
                      <td>22:40</td>
                      <td>272 691,00 ₽</td>
                    </tr>
                    <tr>
                      <td colspan="7"></td>
                      <td class="text-left">Итого: 272 691,00 ₽</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <h3>Жилье</h3>
                  <v-table theme="dark">
                    <thead>
                    <tr>
                      <th class="text-left">Дата</th>
                      <th class="text-left">Размещение</th>
                      <th class="text-left">Кол-во ночей</th>
                      <th class="text-left">Город и адрес отеля</th>
                      <th class="text-left">Доп.инфа о размещении</th>
                      <th class="text-left">Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-left">
                      <td>26 - 27 сентября</td>
                      <td>The Haze Karaköy</td>
                      <td>1</td>
                      <td>TR, Istanbul, Necatibey Caddesi No:36-38, Karaköy</td>
                      <td>Включены завтраки для взрослых, завтрак для ребенка оплачивается на месте (20 евро) </td>
                      <td>17766,00 ₽</td>
                    </tr>
                    <tr class="text-left">
                      <td>27 сентября - 2 октября</td>
                      <td>The Fifty Sonesta Hotel New York 4*</td>
                      <td>5</td>
                      <td>155 East 50th Street, New York, NY 10022</td>
                      <td>Без завтраков, номер с мини-кухней. На месте оплачивается сбор 224 USD</td>
                      <td>254709,00 ₽</td>
                    </tr>
                    <tr>
                      <td colspan="5"></td>
                      <td class="text-left">Итого: 272 691,00 ₽</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <h3>Общественный транспорт</h3>
                  <v-table theme="dark">
                    <thead>
                    <tr>
                      <th class="text-left">Дата</th>
                      <th class="text-left">Категория</th>
                      <th class="text-left">Примечание</th>
                      <th class="text-left">Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-left">
                      <td>26 сентября</td>
                      <td>Такси / трансфер Аэропорт Стамбула - отель </td>
                      <td>41 км (≈50 минут)</td>
                      <td>150,00 $</td>
                    </tr>
                    <tr class="text-left">
                      <td>27 сентября</td>
                      <td>Такси / трансфер Аэропорт Стамбула - отель </td>
                      <td>41 км (≈50 минут)</td>
                      <td>150,00 $</td>
                    </tr>
                    <tr class="text-left">
                      <td>2 октября</td>
                      <td>ТТакси / Трансфер отель - Аэропорт НЙ </td>
                      <td>428 км (≈40 минут)</td>
                      <td>245,00 $</td>
                    </tr>
                    <tr>
                      <td colspan="3"></td>
                      <td class="text-left">Итого: 545,00 $</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <h3>Экскурсии и развлечения</h3>
                  <v-table theme="dark">
                    <thead>
                    <tr>
                      <th class="text-left">Дата</th>
                      <th class="text-left">Категория</th>
                      <th class="text-left">Примечание</th>
                      <th class="text-left">Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-left">
                      <td>28 сентября - 1 октября</td>
                      <td>NewYork Pass</td>
                      <td>https://newyorkpass.com/en </td>
                      <td>1762,00 $</td>
                    </tr>
                    <tr class="text-left">
                      <td>-</td>
                      <td>Полет на Вертолете </td>
                      <td>https://rsbtravel.com/excursion/obzornaya-ekskursiya-po-nyu-yorku </td>
                      <td>645,00 $</td>
                    </tr>
                    <tr>
                      <td colspan="3"></td>
                      <td class="text-left">Итого: 2407,00 $</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <h3>Итого</h3>
                  <v-table>
                    <thead>
                    <tr>
                      <th class="text-left">Категория</th>
                      <th class="text-left">Стоимость</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-left">
                      <td>ПЕРЕЛЕТ</td>
                      <td>432530,00 ₽</td>
                    </tr>
                    <tr class="text-left">
                      <td>ЖИЛЬЕ</td>
                      <td>432530,00 ₽</td>
                    </tr>
                    <tr class="text-left">
                      <td>НАЛОГИ</td>
                      <td>432530,00 ₽</td>
                    </tr>
                    <tr class="text-left">
                      <td></td>
                      <td>Итого: 41214135,00 ₽</td>
                    </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-tabs-window-item>


              <v-tabs-window-item value="two">
                <div style="display: flex; justify-content: space-between; padding: 20px 0 20px 0">
                    <img src="@/assets/images/examples/img.png"  alt=""/>
                    <img src="@/assets/images/examples/img_1.png"  alt=""/>
                    <img src="@/assets/images/examples/img_2.png"  alt=""/>
                </div>

                <div style="padding: 20px 0 20px 0">
                  Погода в октябре прохладная, средняя температура: +12…+20°C, иногда дождь.
                  Как одеваться: лёгкие свитера, джинсы, куртка, ветровка, удобная обувь для прогулок, зонтик.
                </div>

                <div>
                  <v-table theme="dark">
                    <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Активность</th>
                      <th>Примечание </th>
                      <th>Рестораны </th>
                      <th>Маршрут</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>27.09.2025</td>
                      <td>Заселение в отель</td>
                      <td>Заселение в отель поздно вечером. Отдых после перелета. </td>
                      <td>-</td>
                      <td>Аэропорт - отель https://maps.app.goo.gl/SpEqSWmQrCCR1mYc9</td>
                    </tr>
                    <tr>
                      <td rowspan="2">28.09.2025</td>
                      <td>Отель - Таймс-сквер</td>
                      <td>По дороге посетите Центральный вокзал, SUMMIT One Vanderbilt (посетите обзорную площадку по NewYork Pass), погуляйте по Брайант-парк. Дойдя до Таймс-сквер возьмите билеты на обзорные автобусы  BigBusTours (по NewYork Pass) на два дня. </td>
                      <td rowspan="2">1. Smith & Wollensky 2. Ralph's Coffee 3. Tartinery Café - Bar | Park Ave</td>
                      <td>Ссылка на маршрут  https://maps.app.goo.gl/aGa9tF8dqHsTuZf27</td>
                    </tr>
                    <tr>
                      <td>Обзорный автобус  </td>
                      <td>Возьмите маршрут Uptown Loop
                        (синий маршрут). По маршруту вы посетите Rockefeller Center, The Metropolitan Museum of Art и тд .</td>
                      <td>https://www.bigbustours.com/en/new-york/blue-route-new-york</td>
                    </tr>
                    <tr>
                      <td rowspan="2">29.09.2025</td>
                      <td>Обзорный автобус </td>
                      <td>Возьмите маршрут Downtown Loop (красный маршрут). По маршруту вы посетите Empire State Building, SoHo, Brooklyn Bridge, Wall Street, World Trade Center, Chelsea / Pier 57. На остановках можно по NewYork Pass посетить смотровые площадки Empire State Building, One World Observatory, Edge. А также музей 9/11. </td>
                      <td rowspan="2">"1. Sarabeth's Park Avenue South
                        2. The Wilson
                        3. Sadelle's New York 4. Jack's Wife Freda 5. Hudson Eats

                        "</td>
                      <td>https://www.bigbustours.com/en/new-york/red-route-new-york</td>
                    </tr>
                    <tr>
                      <td>Джаз-клуб</td>
                      <td>https://www.birdlandjazz.com/page/2/  или https://www.bluenotejazz.com/nyc/</td>
                      <td>Отель - джаз-клуб №1 https://maps.app.goo.gl/TcJN3c6nx7nUmZf68                                                                  Отель - джаз-клуб №2 https://maps.app.goo.gl/btKjR6BzGuxhpthV9</td>
                    </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-tabs-window-item>

              <v-tabs-window-item value="three">
                <v-carousel>
                  <v-carousel-item
                      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                      cover
                  ></v-carousel-item>

                  <v-carousel-item
                      src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
                      cover
                  ></v-carousel-item>

                  <v-carousel-item
                      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                      cover
                  ></v-carousel-item>
                </v-carousel>
                <v-table theme="dark">
                  <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Активность</th>
                    <th>Примечание </th>
                    <th>Рестораны </th>
                    <th>Маршрут</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>27.09.2025</td>
                    <td>Заселение в отель</td>
                    <td>Заселение в отель поздно вечером. Отдых после перелета. </td>
                    <td>-</td>
                    <td>Аэропорт - отель https://maps.app.goo.gl/SpEqSWmQrCCR1mYc9</td>
                  </tr>
                  <tr>
                    <td rowspan="2">28.09.2025</td>
                    <td>Отель - Таймс-сквер</td>
                    <td>По дороге посетите Центральный вокзал, SUMMIT One Vanderbilt (посетите обзорную площадку по NewYork Pass), погуляйте по Брайант-парк. Дойдя до Таймс-сквер возьмите билеты на обзорные автобусы  BigBusTours (по NewYork Pass) на два дня. </td>
                    <td rowspan="2">1. Smith & Wollensky 2. Ralph's Coffee 3. Tartinery Café - Bar | Park Ave</td>
                    <td>Ссылка на маршрут  https://maps.app.goo.gl/aGa9tF8dqHsTuZf27</td>
                  </tr>
                  <tr>
                    <td>Обзорный автобус  </td>
                    <td>Возьмите маршрут Uptown Loop
                      (синий маршрут). По маршруту вы посетите Rockefeller Center, The Metropolitan Museum of Art и тд .</td>
                    <td>https://www.bigbustours.com/en/new-york/blue-route-new-york</td>
                  </tr>
                  <tr>
                    <td rowspan="2">29.09.2025</td>
                    <td>Обзорный автобус </td>
                    <td>Возьмите маршрут Downtown Loop (красный маршрут). По маршруту вы посетите Empire State Building, SoHo, Brooklyn Bridge, Wall Street, World Trade Center, Chelsea / Pier 57. На остановках можно по NewYork Pass посетить смотровые площадки Empire State Building, One World Observatory, Edge. А также музей 9/11. </td>
                    <td rowspan="2">"1. Sarabeth's Park Avenue South
                      2. The Wilson
                      3. Sadelle's New York 4. Jack's Wife Freda 5. Hudson Eats

                      "</td>
                    <td>https://www.bigbustours.com/en/new-york/red-route-new-york</td>
                  </tr>
                  <tr>
                    <td>Джаз-клуб</td>
                    <td>https://www.birdlandjazz.com/page/2/  или https://www.bluenotejazz.com/nyc/</td>
                    <td>Отель - джаз-клуб №1 https://maps.app.goo.gl/TcJN3c6nx7nUmZf68                                                                  Отель - джаз-клуб №2 https://maps.app.goo.gl/btKjR6BzGuxhpthV9</td>
                  </tr>
                  </tbody>
                </v-table>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>

      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main__travel-voucher {

  font-family: "Times New Roman",sans-serif;
  text-align: center;
  padding: 20px;

  & h3 {
    margin-top: 15px;
  }
}
</style>
