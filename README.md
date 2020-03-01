# USPanel

Çalıştırmak için;

1- USPanel Klasöründe: docker-compose up -d
2- USPanel/Admin Klasöründe npm install

Önemli Uyarılar.

1- Apache de çalıştırmak için App.js deki BrowserRouter basename tagı /Admin şeklinde olmalıdır. Yoksa beyaz ekran verir hatada vermez. 
2- Admin/.env dosyasınıda buna göre güncellemek gerekir.
3- webpack prodda publicPath: /Admin/ olarak girilecektir, klasörün ismine göre.
4- publicPathın anlamı hangi klasörde çalışacak, development ta / ta çalışabilir ancak productionda /Admin olmalıdır.
5- baştaki leading slash /klasor , sondaki ise trailin slash /klasor/