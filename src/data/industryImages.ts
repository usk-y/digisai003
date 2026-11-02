export interface IndustryImagePreset {
  id: string;
  industry: string;
  category: 'food' | 'beauty' | 'medical' | 'service' | 'retail' | 'lifestyle';
  bannerImage: string;
  bannerTitle: string;
  itemImages: {
    title: string;
    url: string;
  }[];
}

export const INDUSTRY_IMAGE_PRESETS: IndustryImagePreset[] = [
  // 1. カフェ・喫茶
  {
    id: 'cafe',
    industry: 'カフェ・喫茶',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '挽きたて珈琲と手作りスイーツ',
    itemImages: [
      { title: '焼きたてカヌレ', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
      { title: 'ハンドドリップ珈琲', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
      { title: 'シフォンケーキ', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
      { title: 'カフェラテ', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 2. 居酒屋・バル
  {
    id: 'izakaya',
    industry: '居酒屋・バル',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '串焼きと厳選地酒・生ビール',
    itemImages: [
      { title: '炭火焼き鳥盛り合わせ', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { title: '朝獲れ鮮魚刺身', url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80' },
      { title: '生ビール＆乾杯', url: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 3. サロン・美容室・エステ
  {
    id: 'salon',
    industry: 'サロン・エステ・美容室',
    category: 'beauty',
    bannerImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '上質なヘアケアとカット',
    itemImages: [
      { title: '透明感ヘアカラー', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80' },
      { title: 'ヘッドスパ＆トリートメント', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
      { title: '美肌フェイシャル', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 4. ベーカリー・パン屋
  {
    id: 'bakery',
    industry: 'ベーカリー・パン屋',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '朝焼き天然酵母パン',
    itemImages: [
      { title: 'クロワッサン', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80' },
      { title: '石窯バゲット', url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80' },
      { title: '食パン・トースト', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 5. アパレル・ファッション
  {
    id: 'sale',
    industry: 'アパレル・セール',
    category: 'retail',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    bannerTitle: 'シーズナルセール＆新作',
    itemImages: [
      { title: '新作ジャケット', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80' },
      { title: '春物ワンピース', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 6. クリニック・医療
  {
    id: 'clinic',
    industry: 'クリニック・内科・小児科',
    category: 'medical',
    bannerImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '安心の地域医療と予防接種',
    itemImages: [
      { title: '医師による診察', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80' },
      { title: '健康診断・検診', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 7. ラーメン・麺処
  {
    id: 'ramen',
    industry: '飲食・ラーメン・麺処',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '極上スープの特製ラーメン',
    itemImages: [
      { title: '濃厚とんこつ醤油', url: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=400&q=80' },
      { title: '芳醇淡麗塩らーめん', url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=400&q=80' },
      { title: '手包みパリパリ餃子', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 8. 整体・リラクゼーション
  {
    id: 'relaxation',
    industry: '整体・リラクゼーション',
    category: 'medical',
    bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '骨盤矯正とボディケア',
    itemImages: [
      { title: '全身もみほぐし', url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80' },
      { title: 'アロマオイルマッサージ', url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 9. フィットネス・ジム
  {
    id: 'fitness',
    industry: 'フィットネス・ジム・ヨガ',
    category: 'lifestyle',
    bannerImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '24時間いつでもトレーニング',
    itemImages: [
      { title: 'パーソナル指導', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80' },
      { title: 'ヨガ・ピラティス', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 10. ホテル・旅館
  {
    id: 'hotel',
    industry: 'ホテル・旅館・宿泊',
    category: 'lifestyle',
    bannerImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    bannerTitle: 'くつろぎの客室とおもてなし',
    itemImages: [
      { title: 'プレミアム客室', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
      { title: '地元食材の会席料理', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 11. 歯科・デンタル
  {
    id: 'dental',
    industry: '歯科・デンタルクリニック',
    category: 'medical',
    bannerImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '痛みの少ないホワイトニング＆予防歯科',
    itemImages: [
      { title: '審美ホワイトニング', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80' },
      { title: '定期予防クリーニング', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 12. 焼肉・韓国料理
  {
    id: 'yakiniku',
    industry: '焼肉・韓国料理',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '厳選黒毛和牛と熟成肉',
    itemImages: [
      { title: '特選カルビ', url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80' },
      { title: '厚切り極上タン塩', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 13. イタリアン・ピザ
  {
    id: 'italian',
    industry: 'イタリアン・ピッツェリア',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '薪窯焼きナポリピッツァ',
    itemImages: [
      { title: 'マルゲリータピッツァ', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=400&q=80' },
      { title: '濃厚カルボナーラ', url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 14. 寿司・海鮮料理
  {
    id: 'sushi',
    industry: '寿司・海鮮料理',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '豊洲市場直送・江戸前握り',
    itemImages: [
      { title: '特上江戸前握り', url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=400&q=80' },
      { title: '豪華海鮮丼', url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 15. ネイルサロン・まつ毛
  {
    id: 'nail',
    industry: 'ネイルサロン・まつげ',
    category: 'beauty',
    bannerImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '定額トレンドアートデザイン',
    itemImages: [
      { title: 'ニュアンスネイル', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80' },
      { title: 'まつ毛パーマ・エクステ', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 16. 学習塾・進学予備校
  {
    id: 'juku',
    industry: '学習塾・進学予備校',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '志望校合格・個別指導',
    itemImages: [
      { title: '完全個別指導ブース', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80' },
      { title: '自習室完備', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 17. 不動産・賃貸仲介
  {
    id: 'realestate',
    industry: '不動産・賃貸仲介',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '駅近デザイナーズ賃貸＆売買',
    itemImages: [
      { title: '新築デザイナーズマンション', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' },
      { title: '日当たり良好ファミリー物件', url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 18. ペットサロン・動物病院
  {
    id: 'pet',
    industry: 'ペットサロン・動物病院',
    category: 'lifestyle',
    bannerImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    bannerTitle: 'ワンちゃんのトリミング＆ケア',
    itemImages: [
      { title: 'シャンプー＆カットコース', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80' },
      { title: 'ハーブ泡パック', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 19. フラワーショップ・生花店
  {
    id: 'flower',
    industry: 'フラワーショップ・生花',
    category: 'retail',
    bannerImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '季節の花束とブーケ・観葉植物',
    itemImages: [
      { title: '季節のオーダーブーケ', url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80' },
      { title: '癒やしの観葉植物', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 20. カーディーラー・車検整備
  {
    id: 'car',
    industry: 'カーディーラー・自動車整備',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '安心の車検点検＆オイル交換',
    itemImages: [
      { title: 'ガラスコーティング', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80' },
      { title: 'スピード車検・点検', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 21. クリーニング・ランドリー
  {
    id: 'cleaning',
    industry: 'クリーニング・コインランドリー',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '除菌消臭スニーカー＆布団丸洗い',
    itemImages: [
      { title: 'ワイシャツ抗菌仕上げ', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80' },
      { title: '大型羽毛布団丸洗い', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 22. 和菓子・お茶処
  {
    id: 'wagashi',
    industry: '和菓子・お茶処',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '手作り大福と上生菓子',
    itemImages: [
      { title: 'いちご大福', url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80' },
      { title: '濃厚宇治抹茶', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 23. サウナ・温浴施設
  {
    id: 'spa',
    industry: 'サウナ・温浴施設・スパ',
    category: 'lifestyle',
    bannerImage: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '本格フィンランドサウナ＆天然温泉',
    itemImages: [
      { title: 'ロウリュサウナ', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80' },
      { title: '水風呂＆外気浴', url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 24. コワーキング・シェアオフィス
  {
    id: 'coworking',
    industry: 'コワーキング・シェアオフィス',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '高速Wi-Fi完備・テレワーク拠点',
    itemImages: [
      { title: 'オープンドロップイン席', url: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=400&q=80' },
      { title: '個室ブース・会議室', url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 25. バー・ナイトラウンジ
  {
    id: 'bar',
    industry: 'バー・ナイトラウンジ',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    bannerTitle: 'オリジナルカクテルとウイスキー',
    itemImages: [
      { title: 'シグネチャーカクテル', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
      { title: 'シングルモルトウイスキー', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 26. 本格カレー・スパイス
  {
    id: 'curry',
    industry: '本格カレー・スパイス料理',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '本格スパイスチキンカレー',
    itemImages: [
      { title: 'バターチキンカレー', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80' },
      { title: '焼きたてチーズナン', url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 27. パティスリー・洋菓子店
  {
    id: 'cake',
    industry: 'パティスリー・ケーキ洋菓子',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '旬のフルーツタルトと記念日ケーキ',
    itemImages: [
      { title: '苺のプレミアムショート', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80' },
      { title: '濃厚ショコラタルト', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 28. メガネ・補聴器専門店
  {
    id: 'optician',
    industry: 'メガネ・補聴器専門店',
    category: 'retail',
    bannerImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '最新ブルーライトカット＆軽量フレーム',
    itemImages: [
      { title: 'クラシックチタンフレーム', url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80' },
      { title: 'PC用ブルーライト眼鏡', url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 29. スマホ・時計修理
  {
    id: 'repair',
    industry: 'スマホ・時計・靴修理',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '最短20分即日画面修理・バッテリー交換',
    itemImages: [
      { title: '液晶ガラス割れ即日交換', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' },
      { title: '大容量バッテリー交換', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 30. 農産物直売所・ファーマーズ
  {
    id: 'farm',
    industry: '農産物直売所・ファーマーズ',
    category: 'retail',
    bannerImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '今朝採れたて新鮮野菜と果物',
    itemImages: [
      { title: '完熟朝採れトマト', url: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=400&q=80' },
      { title: '旬の採れたて野菜セット', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 31. フォトスタジオ・写真館
  {
    id: 'photo',
    industry: 'フォトスタジオ・写真館',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '七五三・成人式・家族記念撮影',
    itemImages: [
      { title: '七五三キッズ撮影プラン', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
      { title: '成人式前撮りロケーション', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 32. 調剤薬局・ドラッグストア
  {
    id: 'pharmacy',
    industry: '調剤薬局・ドラッグストア',
    category: 'medical',
    bannerImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '全国の処方せん受付・健康相談',
    itemImages: [
      { title: 'お薬手帳アプリ対応', url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80' },
      { title: '薬剤師による健康相談', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 33. ゴルフ練習場・スクール
  {
    id: 'golf',
    industry: 'ゴルフ練習場・シミュレーター',
    category: 'lifestyle',
    bannerImage: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '最新弾道測定インドアゴルフ',
    itemImages: [
      { title: '最新シミュレーター打席', url: 'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=400&q=80' },
      { title: 'プロによるマンツーマンレッスン', url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 34. アジアン・エスニック料理
  {
    id: 'oriental',
    industry: 'アジアン・エスニック料理',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '本格ガパオライスとトムヤムクン',
    itemImages: [
      { title: '鶏肉のハーブガパオ', url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80' },
      { title: '本場生春巻き', url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 35. キャンプ・アウトドア用品
  {
    id: 'camp',
    industry: 'キャンプ・アウトドア用品',
    category: 'retail',
    bannerImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '本格ソロ＆ファミリーキャンプギア',
    itemImages: [
      { title: '焚き火台＆クッカー', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      { title: 'ワンポールテント', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 36. 音楽教室・楽器店
  {
    id: 'music',
    industry: '音楽教室・楽器店',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '無料体験レッスン受付中・初心者歓迎',
    itemImages: [
      { title: 'アコースティックギター', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80' },
      { title: 'グランドピアノレッスン', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 37. リサイクル・買取専門店
  {
    id: 'recycle',
    industry: 'リサイクル・買取専門店',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '金・プラチナ・ブランド品高価買取',
    itemImages: [
      { title: '高級腕時計・ジュエリー', url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=400&q=80' },
      { title: 'ブランドバッグ査定', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 38. 洋食・ステーキハウス
  {
    id: 'western',
    industry: '洋食・ステーキハウス',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '手ごね黒毛和牛ハンバーグ',
    itemImages: [
      { title: '肉汁粗挽きハンバーグ', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80' },
      { title: 'サーロインステーキ', url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 39. 英会話・語学スクール
  {
    id: 'english',
    industry: '英会話・語学スクール',
    category: 'service',
    bannerImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    bannerTitle: 'ネイティブ講師と楽しくマンツーマン',
    itemImages: [
      { title: '日常会話レッスン', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80' },
      { title: 'ビジネス英語・TOEIC対策', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  // 40. ブライダル・結婚式場
  {
    id: 'wedding',
    industry: 'ブライダル・式場相談',
    category: 'lifestyle',
    bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    bannerTitle: '感動のフォトウエディング＆相談会',
    itemImages: [
      { title: 'チャペル挙式プラン', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80' },
      { title: 'ドレス試着フェア', url: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80' },
    ],
  },
];
