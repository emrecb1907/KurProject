import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import IslamicHistoryLesson, { LessonContent } from '@/components/lessons/IslamicHistoryLesson';

const islamicHistoryContent: Record<string, LessonContent> = {
  '1': {
    title: 'Peygamberlik Öncesi Hz. Muhammed\'in Hayatı',
    content: [
      {
        section: 'Giriş',
        text: [
          'Hz. Muhammed (s.a.v.), miladi 570 yılı civarında Mekke\'de dünyaya geldi. Mekke o dönem hem ticaretin hem de putperest inançların merkeziydi. Toplum, kabileler arasında dağılmış, sosyal sınıflar keskin şekilde ayrılmıştı. Böyle bir ortamda onun hayatı, daha çocukluk yıllarından başlayarak çevresindeki insanlardan farklı bir çizgide ilerledi.',
        ],
      },
      {
        section: '👶 Çocukluk ve Gençlik Yılları',
        text: [
          'Hz. Muhammed küçük yaşta yetim kaldı; önce dedesi Abdülmuttalib\'in, ardından amcası Ebu Talib\'in yanında büyüdü. Bu durum onu kırgın bir karakter yapmadı; aksine empatiyi ve adaleti çok erken öğrenmesine vesile oldu. Kimseyi ezmeyen, zayıfa sahip çıkan bir duruş geliştirdi.',
          'Gençlik çağında Mekke\'nin sosyal hayatında öne çıkan özelliklerinden biri de dürüstlüğüydü. Ticarette hileye alışmış bir toplumda, onun dürüstlüğü dikkat çekiyordu. İnsanlar "Muhammedü\'l-Emin" yani Güvenilir Muhammed diye anmaya başlamıştı. Bu unvanı bir insanın kendisine değil, toplumunun ona verdiğini özellikle not etmek gerekir; onun karakterinin toplumda nasıl bir iz bıraktığını gösteren en güçlü işaretlerden biridir.',
        ],
      },
      {
        section: '🐪 Ticaret Hayatı ve Yolculuklar',
        text: [
          'Genç yaşta yaptığı ticaret yolculukları onu Mekke\'nin dışındaki kültürlerle tanıştırdı. Farklı toplulukların yaşamını, inançlarını ve davranışlarını gözlemleme fırsatı buldu. Bu gözlemler onda geniş bir ufuk açtı: İnsanların farklılıklarına rağmen ortak bir adalet ve merhamet arayışında olduğunu fark etti.',
          'Ticaret kervanlarında gösterdiği dürüstlük ve güvenilirlik, Hz. Hatice ile yollarının kesişmesine vesile oldu. Onun için yaptığı ticaret işlerinde gösterdiği dikkat ve adalet, herkesin dilindeydi.',
        ],
      },
      {
        section: '🕊️ Toplumsal Haksızlıklara Karşı Duruşu',
        text: [
          'Mekke toplumunda güçlü olanın zayıfı ezdiği, kadınların ve yetimlerin çoğu zaman hakkını savunamadığı bir düzen vardı. Hz. Muhammed bu haksızlıklara karşı duranlardan biriydi. Hilfu\'l-Fudûl anlaşmasına genç yaşta katılması —zulme uğrayanların hakkını savunmak için kurulan bir topluluk— onun adalet duygusunun erken yaşta ne kadar güçlü olduğunu gösterir.',
        ],
      },
      {
        section: '🌙 Yalnızlığı ve Derin Düşünmeyi Tercih Etmesi',
        text: [
          'Yaşadığı toplumda putperestlik yaygındı; fakat Hz. Muhammed bu inanç biçimine hiçbir zaman yönelmedi. Mekke\'nin gürültüsünden uzaklaşarak tefekkür etmeyi severdi. Hira Mağarası\'na çekilmesi, onun iç dünyasının sessizlik ve anlam arayışıyla şekillendiğini gösterir. Bu yalnızlık, bir kaçış değil; hayatı, insanı ve adaleti daha derin düşünme çabasıydı.',
        ],
      },
      {
        section: '🌿 Özetle…',
        text: [
          'Peygamberlikten önceki hayatı, onun karakterinin temel taşlarını oluşturdu:',
          '-Dürüstlük',
          '-Merhamet',
          '-Adalet',
          '-Empati',
          '-Sorumluluk',
          '-Derin düşünme ve sorgulama',
          'Bu özellikler, daha sonra alacağı büyük görevin zeminini hazırladı. Toplumu değiştirecek bir liderin, önce kendi iç dünyasında olgunlaştığını gösteren bir süreçti.',
        ],
      },
    ],
  },
};

export default function IslamicHistoryLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = islamicHistoryContent[id || '1'];

  if (!lesson) {
    return null;
  }

  return <IslamicHistoryLesson lesson={lesson} />;
}

