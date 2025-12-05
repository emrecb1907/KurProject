import { useLocalSearchParams } from 'expo-router';
import IslamicHistoryLesson, { LessonContent } from '@/components/lessons/IslamicHistoryLesson';

const islamicHistoryContent: Record<string, LessonContent> = {
  '412': {
    title: 'Modern Çağda İslam Dünyası (1800–Günümüz)',
    content: [
      {
        section: 'Giriş',
        text: [
          '1800\'lerden itibaren İslam dünyası, daha önceki yüzyıllardan farklı bir dönemle karşı karşıya kaldı. Bu dönem; sanayileşme, modern devlet yapılarının oluşumu, küreselleşme, eğitim reformları ve toplumların hızlı değişimi gibi gelişmelerle şekillendi. Modern çağ, İslam dünyasında hem zorlukların hem de yeni fırsatların ortaya çıktığı çok yönlü bir dönüşüm sürecidir.',
        ],
      },
      {
        section: '1. Sanayi Devrimi ve Yeni Dünya Düzeni',
        text: [
          '18. ve 19. yüzyıllarda Avrupa\'da başlayan Sanayi Devrimi, dünya dengelerini köklü biçimde değiştirdi. Bu değişim, İslam coğrafyasını doğrudan etkiledi.',
          '-Teknolojideki hızlı ilerleme',
          '-Yeni ticaret yolları',
          '-Küresel ekonominin yeniden şekillenmesi',
          'bu dönemde İslam dünyasının uluslararası ilişkilerini yeniden değerlendirmesini zorunlu kıldı. Birçok bölgede modern kurumlar, yeni eğitim yöntemleri ve idari düzenlemeler bu ihtiyaçtan doğdu.',
        ],
      },
      {
        section: '2. Modern Devletlerin Ortaya Çıkışı',
        text: [
          '19. ve 20. yüzyıllar boyunca İslam coğrafyasında yeni siyasi yapılar kuruldu. Osmanlı gibi eski imparatorlukların yerini, bağımsız ve modern ulus devletler almaya başladı.',
          'Bu süreçte:',
          '-Yeni anayasalar hazırlandı',
          '-Yönetim sistemleri yeniden düzenlendi',
          '-Eğitim ve hukuk kurumları modernleştirildi',
          'Bu değişimler, toplumların geleceğini belirleyen önemli adımlardı.',
        ],
      },
      {
        section: '3. Eğitim ve Toplumsal Reformlar',
        text: [
          'Modern çağ, İslam dünyasında eğitimin yaygınlaşması ve modern okulların kurulmasıyla öne çıktı. Geleneksel eğitim kurumları varlığını sürdürürken, bilim, matematik, tarih ve sosyal bilimler gibi alanlarda yeni ders programları oluşturuldu.',
          'Bu süreç:',
          '-Okuryazarlık oranının yükselmesine',
          '-Mesleki eğitimin gelişmesine',
          '-Bilimsel düşüncenin yaygınlaşmasına',
          'zemin hazırladı.',
        ],
      },
      {
        section: '4. Küreselleşme ve Kültürel Etkileşim',
        text: [
          '20. yüzyılın ikinci yarısından itibaren dünya daha bağlantılı bir hâle geldi. Ulaşım ve iletişimin hızlanması, İslam dünyasının hem birbirleriyle hem de farklı kültürlerle daha yoğun temas kurmasını sağladı.',
          'Bu dönemde:',
          '-Farklı fikirlerin daha hızlı dolaşması',
          '-Ekonomik ilişkilerin artması',
          '-Uluslararası eğitim ve işbirliklerinin çoğalması',
          'gibi gelişmeler yaşandı.',
          'Kültürel etkileşimler hem geleneklerin korunmasını hem de yeni düşüncelerin benimsenmesini mümkün kıldı.',
        ],
      },
      {
        section: '5. Ekonomik Çeşitlilik ve Kalkınma Çabaları',
        text: [
          'Modern çağda İslam dünyasının ekonomik yapısı da çeşitlendi. Bazı ülkeler enerji kaynakları, bazıları ticaret, bazıları ise üretim ve hizmet sektörleri üzerinden gelişme stratejileri benimsedi.',
          'Ekonomik çeşitlilik:',
          '-Şehirleşmenin hızlanmasına',
          '-Yeni meslek alanlarının doğmasına',
          '-Bölgesel işbirliklerinin artmasına',
          'imkan sağladı.',
        ],
      },
      {
        section: '6. Toplumsal Değişim ve Sosyal Yapı',
        text: [
          '1800\'lerden günümüze toplumlar hızlı bir dönüşüm yaşadı. Bu dönemde:',
          '-Kadınların eğitim ve iş hayatına daha fazla katılımı',
          '-Aile yapılarındaki değişim',
          '-Nüfusun şehir merkezlerinde yoğunlaşması',
          '-Genç nüfusun artan rolü',
          'gibi sosyal gelişmeler öne çıktı.',
          'Bu değişimler toplumların kültürel yapısını zenginleştiren unsurlar haline geldi.',
        ],
      },
      {
        section: '7. Modern Dünyada Dini Yaşam',
        text: [
          'Günümüz İslam toplumlarında dini hayat hem bireysel hem toplumsal düzeyde önemli bir konumda olmaya devam ediyor. Modern iletişim araçlarının yaygınlaşmasıyla birlikte:',
          '-Din eğitimi daha erişilebilir hale geldi',
          '-Bilgi kaynakları çeşitlendi',
          '-Farklı bölgeler arasında bilgi alışverişi arttı',
          'Buna rağmen dini uygulamalar geleneksel yapıyı koruyarak devam ediyor.',
        ],
      },
      {
        section: 'Genel Değerlendirme',
        text: [
          'Modern çağda İslam dünyası:',
          '-Yeni siyasi yapılar geliştirmiş,',
          '-Ekonomik ve sosyal değişim süreçlerinden geçmiş,',
          '-Küresel kültürle yoğun temas kurmuş,',
          '-Eğitim, hukuk ve yönetim alanlarında yeniliklere uyum sağlamış',
          'çok geniş ve dinamik bir coğrafyadır.',
          'Bu dönem, İslam medeniyetinin tarih boyunca sürdürdüğü çeşitliliğin modern bir yansımasıdır. Değişim ve gelenek arasındaki denge, günümüz İslam toplumlarının temel özelliklerinden biri haline gelmiştir.',
        ],
      },
    ],
  },
};

export default function IslamicHistoryLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = islamicHistoryContent[id || '412'];

  if (!lesson) {
    return null;
  }

  return <IslamicHistoryLesson lesson={lesson} lessonId="412" />;
}

