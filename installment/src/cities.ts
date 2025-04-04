

let province = [{ value: 1, key: 'آذربایجان شرقی' },
{ value: 2, key: 'آذربایجان غربی'},
{ value: 3, key: 'اردبیل' },
{ value: 4, key: 'اصفهان'},
{ value: 5, key: 'البرز'},
{ value: 6, key: 'ایلام'},
{ value: 7, key: 'بوشهر'},
{ value: 8, key: 'تهران'},
{ value: 9, key: 'چهارمحال و بختیاری'},
{ value: 10, key: 'خراسان جنوبی'},
{ value: 11, key: 'خراسان رضوی'},
{ value: 12, key: 'خراسان شمالی' },
{ value: 13, key: 'خوزستان'},
{ value: 14, key: 'زنجان'},
{ value: 15, key: 'سمنان' },
{ value: 16, key: 'سیستان و بلوچستان' },
{ value: 17, key: 'فارس' },
{ value: 18, key: 'قزوین'},
{ value: 19, key: 'قم' },
{ value: 20, key: 'کردستان' },
{ value: 21, key: 'کرمان'},
{ value: 22, key: 'کرمانشاه'},
{ value: 23, key: 'کهگیلویه و بویراحمد' },
{ value: 24, key: 'گلستان'},
{ value: 25, key: 'لرستان'},
{ value: 26, key: 'گیلان' },
{ value: 27, key: 'مازندران' },
{ value: 28, key: 'مرکزی' },
{ value: 29, key: 'هرمزگان'},
{ value: 30, key: 'همدان' },
{ value: 31, key: 'یزد'}]


export default async (params:number) => {
    let provi ;
    province.forEach((elem)=>{
        if (elem.value == params){
            provi = elem.key;
        }
    })
    return provi
}


// 		let allCities = {
// 		  1:[{key : 'احمدآبادمستوفي' , value : 1},
// 		  {key : 'ادران' , value : 2} ,
// 		  'اسلام آباد' ,
// 		  'اسلام شهر',
// 		  'اكبرآباد' ,
// 		  'اميريه' ,
// 		  'انديشه' ,
// 		  'اوشان' ,
// 		  'آبسرد' ,
//                 'آبعلي',
//                 'باغستان',
//                 'باقر شهر',
//                 'برغان',
//                 'بومهن',
//                 'پارچين',
//                 'پاكدشت' ,
// 			  'پرديس',
//                 'پرند',
//                 'پس قلعه',
//                 'پيشوا' ,
// 			  'تجزيه مبادلات لشكر  ' ,
// 			  'تهران',
// 			  'جاجرود',
//                 'چرمسازي سالاريه',
//                 'چهاردانگه',
//                 'حسن آباد',
//                 'حومه گلندوك',
//                 'خاتون آباد',
//                 'خاوه',
//                 'خرمدشت',
//                 'دركه',
//                 'دماوند' ,
// 			  'رباط كريم' ,
// 			  'رزگان',
//                 'رودهن',
//                 'ري' ,
// 			  'سعيدآباد',
//                 'سلطان آباد',
//                 'سوهانك',
//                 'شاهدشهر',
//                 'شريف آباد',
//                 'شمس آباد',
//                 'شهر قدس' ,
// 			  'شهرآباد',
//                 'شهرجديدپرديس',
//                 'شهرقدسمويز)',
//                 'شهريار' ,
// 			  'شهرياربردآباد',
//                 'صالح آباد',
//                 'صفادشت',
//                 'فرودگاه امام خميني',
//                 'فرون آباد',
//                 'فشم',
//                 'فيروزكوه' ,
// 			  'قرچك',
//                 'قيام دشت',
//                 'كهريزك',
//                 'كيلان',
//                 'گلدسته',
//                 'گلستان بهارستان)',
//                 'گيلاوند',
//                 'لواسان' ,
// 			  'لوسان بزرگ',
//                 'مارليك',
//                 'مروزبهرام',
//                 'ملارد',
//                 'منطقه 11 پستي تهران' ,
// 			  'منطقه 13 پستي تهران' ,
// 			  'منطقه 14 پستي تهران' ,
// 			  'منطقه 15 پستي تهران' ,
// 			  'منطقه 16 پستي تهران' ,
// 			  'منطقه 17 پستي تهران  ' ,
// 			  'منطقه 18 پستي تهران  ' ,
// 			  'منطقه 19 پستي تهران  ' ,
// 			  'نسيم شهر بهارستان)',
//                 'نصيرآباد',
//                 'واوان',
//                 'وحيديه',
//                 'ورامين' ,
// 			  'وهن آباد',]
// 		}
		
// 		2:{
// 			[{value : 1 , key :  ('احمد سرگوراب' , '43591')}
// 			2 =  ('اسالم' , '43891');
// 			3 =  ('اسكلك' , '44681');
// 			4 =  ('اسلام آباد' , '43371');
// 			5 =  ('اطاقور' , '44791');
// 			6 =  ('املش' , '44951');
// 			7 =  ('آبكنار' , '4331');
// 			8 =  ('آستارا' , '4391');
// 			9 =  ('آستانه اشرفيه' , '4441');
// 			10 =  ('بازاراسالم' , '43731');
// 			11 =  ('بازارجمعه شاندرمن' , '43811');
// 			12 =  ('برهسر' , '44561');
// 			13 =  ('بلترك' , '44941');
// 			14 =  ('بلسبنه' , '43471');
// 			15 =  ('بندرانزلي' , '431');
// 			16 =  ('پاشاكي' , '44331');
// 			17 =  ('پرهسر' , '43861');
// 			18 =  ('پلاسي' , '43791');
// 			19 =  ('پونل' , '44992');
// 			20 =  ('پيربست لولمان' , '43441');
// 			21 =  ('توتكابن' , '44651');
// 			22 =  ('جوكندان' , '43751');
// 			23 =  ('جيرنده' , '44551');
// 			24 =  ('چابكسر' , '44871');
// 			25 =  ('چاپارخانه' , '43481');
// 			26 =  ('چوبر' , '43561');
// 			27 =  ('خاچكين' , '43451');
// 			28 =  ('خشك بيجار' , '43391');
// 			29 =  ('خطبه سرا' , '43771');
// 			30 =  ('خمام' , '4341');
// 			31 =  ('ديلمان' , '44391');
// 			32 =  ('رانكوه' , '44861');
// 			33 =  ('رحيم آباد' , '44931');
// 			34 =  ('رستم آباد' , '44641');
// 			35 =  ('رشت' , '41');
// 			36 =  ('رضوان شهر' , '43841');
// 			37 =  ('رودبار' , '4461');
// 			38 =  ('رودسر' , '4481');
// 			39 =  ('سراوان' , '43381');
// 			40 =  ('سنگر' , '43361');
// 			41 =  ('سياهكل' , '4431');
// 			42 =  ('شاندرمن' , '43851');
// 			43 =  ('شفت' , '43541');
// 			44 =  ('صومعه سرا' , '4361');
// 			45 =  ('طاهر گوداب' , '43651');
// 			46 =  ('طوللات' , '44851');
// 			47 =  ('فومن' , '4351');
// 			48 =  ('قاسم آبادسفلي' , '44831');
// 			49 =  ('كپورچال' , '43331');
// 			50 =  ('كلاچاي' , '4491');
// 			51 =  ('كوچصفهان' , '43461');
// 			52 =  ('كومله' , '44761');
// 			53 =  ('كياشهر' , '44471');
// 			54 =  ('گشت' , '43581');
// 			55 =  ('لاهيجان' , '441');
// 			56 =  ('لشت نشا' , '43431');
// 			57 =  ('لنگرود' , '4471');
// 			58 =  ('لوشان' , '44531');
// 			59 =  ('لولمان' , '43531');
// 			60 =  ('لوندويل' , '43961');
// 			61 =  ('ليسار' , '43761');
// 			62 =  ('ماسال' , '4381');
// 			63 =  ('ماسوله' , '43571');
// 			64 =  ('منجيل' , '4451');
// 			65 =  ('هشتپر ـ طوالش' , '4371');
// 			66 =  ('واجارگاه' , '44891');]
// 		}
// 		if(state == 3)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ابشاحمد' , '54671');
// 			2 =  ('اذغان' , '54561');
// 			3 =  ('اسب فروشان' , '54731');
// 			4 =  ('اسكو' , '5351');
// 			5 =  ('اغچه ريش' , '5586');
// 			6 =  ('اقمنار' , '55661');
// 			7 =  ('القو' , '55541');
// 			8 =  ('اهر' , '5451');
// 			9 =  ('ايلخچي' , '53581');
// 			10 =  ('آذرشهر' , '5371');
// 			11 =  ('باسمنج' , '53661');
// 			12 =  ('بخشايش ـ كلوانق' , '53951');
// 			13 =  ('بستان آباد' , '5491');
// 			14 =  ('بناب' , '5551');
// 			15 =  ('بناب جديد ـ مرند' , '54351');
// 			16 =  ('تبريز' , '51');
// 			17 =  ('ترك' , '53331');
// 			18 =  ('تسوج' , '53881');
// 			19 =  ('جلفا' , '5441');
// 			20 =  ('خامنه' , '53841');
// 			21 =  ('خداآفرين' , '54683');
// 			22 =  ('خسروشهر' , '53551');
// 			23 =  ('خضرلو' , '55441');
// 			24 =  ('خلجان' , '53641');
// 			25 =  ('سبلان' , '5321');
// 			26 =  ('سراب' , '5471');
// 			27 =  ('سردرود' , '5361');
// 			28 =  ('سيس' , '53851');
// 			29 =  ('شادبادمشايخ' , '53671');
// 			30 =  ('شبستر' , '5381');
// 			31 =  ('شربيان' , '54751');
// 			32 =  ('شرفخانه' , '53891');
// 			33 =  ('شهر جديد سهند' , '5331');
// 			34 =  ('صوفيان' , '53861');
// 			35 =  ('عجب شير' , '5541');
// 			36 =  ('قره اغاج ـ چاراويماق' , '5581');
// 			37 =  ('قره بابا' , '54941');
// 			38 =  ('كردكندي' , '54971');
// 			39 =  ('كليبر' , '5461');
// 			40 =  ('كندرود' , '53681');
// 			41 =  ('كندوان' , '54685');
// 			42 =  ('گوگان' , '53761');
// 			43 =  ('مراغه' , '551');
// 			44 =  ('مرند' , '541');
// 			45 =  ('ملكان' , '5561');
// 			46 =  ('ممقان' , '53751');
// 			47 =  ('ميانه' , '531');
// 			48 =  ('هاديشهر' , '5431');
// 			49 =  ('هريس' , '5391');
// 			50 =  ('هشترود' , '5571');
// 			51 =  ('هوراند' , '54491');
// 			52 =  ('ورزقان' , '54581');
// 		}
// 		if(state == 4)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اروندكنار' , '6331');
// 			2 =  ('اميديه' , '63731');
// 			3 =  ('انديمشك' , '6481');
// 			4 =  ('اهواز' , '61');
// 			5 =  ('ايذه' , '6391');
// 			6 =  ('آبادان' , '631');
// 			7 =  ('آغاجاري' , '6371');
// 			8 =  ('باغ ملك' , '63951');
// 			9 =  ('بندرامام خميني' , '63561');
// 			10 =  ('بهبهان' , '6361');
// 			11 =  ('جايزان' , '63881');
// 			12 =  ('جنت مكان' , '64541');
// 			13 =  ('چمران ـ شهرك طالقاني ' , '63541');
// 			14 =  ('حميديه' , '63441');
// 			15 =  ('خرمشهر' , '641');
// 			16 =  ('دزآب' , '64651');
// 			17 =  ('دزفول' , '6461');
// 			18 =  ('دهدز' , '63991');
// 			19 =  ('رامشير' , '63871');
// 			20 =  ('رامهرمز' , '6381');
// 			21 =  ('سربندر' , '63551');
// 			22 =  ('سردشت' , '63681');
// 			23 =  ('سماله' , '64561');
// 			24 =  ('سوسنگرد ـ دشت آزادگان' , '6441');
// 			25 =  ('شادگان' , '6431');
// 			26 =  ('شرافت' , '64511');
// 			27 =  ('شوش' , '6471');
// 			28 =  ('شوشتر' , '6451');
// 			29 =  ('شيبان' , '61481');
// 			30 =  ('صالح مشطت' , '64791');
// 			31 =  ('كردستان بزرگ' , '63661');
// 			32 =  ('گتوند' , '64551');
// 			33 =  ('لالي' , '64941');
// 			34 =  ('ماهشهر' , '6351');
// 			35 =  ('مسجد سليمان' , '6491');
// 			36 =  ('ملاثاني' , '6341');
// 			37 =  ('ميانكوه' , '63751');
// 			38 =  ('هفتگل' , '64961');
// 			39 =  ('هنديجان' , '63591');
// 			40 =  ('هويزه' , '64451');
// 			41 =  ('ويس' , '61491');
// 		}
// 		if(state == 5)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  (' بيضا' , '73631');
// 			2 =  ('اردكان ـ سپيدان' , '7361');
// 			3 =  ('ارسنجان' , '73761');
// 			4 =  ('استهبان' , '7451');
// 			5 =  ('اشكنان ـ اهل' , '74391');
// 			6 =  ('اقليد' , '7381');
// 			7 =  ('اكبرآبادكوار' , '71651');
// 			8 =  ('اوز' , '74331');
// 			9 =  ('ايزدخواست' , '73991');
// 			10 =  ('آباده' , '7391');
// 			11 =  ('آباده طشك' , '74931');
// 			12 =  ('بالاده' , '73391');
// 			13 =  ('بانش' , '73681');
// 			14 =  ('بنارويه' , '74361');
// 			15 =  ('بهمن' , '73911');
// 			16 =  ('بوانات' , '73941');
// 			17 =  ('بوانات(سوريان)' , '73971');
// 			18 =  ('بيرم' , '74381');
// 			19 =  ('جنت شهر(دهخير)' , '74891');
// 			20 =  ('جهرم' , '741');
// 			21 =  ('جويم' , '74351');
// 			22 =  ('حاجي آباد ـ زرين دشت' , '74861');
// 			23 =  ('حسن آباد' , '73841');
// 			24 =  ('خرامه' , '73441');
// 			25 =  ('خرمی' , '74998');
// 			26 =  ('خشت' , '73341');
// 			27 =  ('خنج' , '74431');
// 			28 =  ('خيرآبادتوللي' , '71451');
// 			29 =  ('داراب' , '7481');
// 			30 =  ('داريان' , '71461');
// 			31 =  ('دهرم' , '74781');
// 			32 =  ('رونيز ' , '74461');
// 			33 =  ('زاهدشهر' , '74671');
// 			34 =  ('زرقان' , '7341');
// 			35 =  ('سروستان' , '73451');
// 			36 =  ('سعادت شهر ـ پاسارگاد' , '73741');
// 			37 =  ('سيدان' , '73771');
// 			38 =  ('ششده' , '74651');
// 			39 =  ('شهر جديد صدرا' , '71991');
// 			40 =  ('شيراز' , '71');
// 			41 =  ('صغاد' , '73931');
// 			42 =  ('صفاشهر ـ خرم بيد' , '73951');
// 			43 =  ('طسوج' , '71641');
// 			44 =  ('علاءمرودشت' , '74441');
// 			45 =  ('فدامي' , '74871');
// 			46 =  ('فراشبند' , '74771');
// 			47 =  ('فسا' , '7461');
// 			48 =  ('فيروزآباد' , '7471');
// 			49 =  ('فيشور' , '74311');
// 			50 =  ('قادرآباد' , '73751');
// 			51 =  ('قائميه' , '7331');
// 			52 =  ('قطب آباد' , '74551');
// 			53 =  ('قطرويه' , '74981');
// 			54 =  ('قير و كارزين' , '74761');
// 			55 =  ('كازرون' , '731');
// 			56 =  ('كام فيروز' , '73431');
// 			57 =  ('كلاني' , '73141');
// 			58 =  ('كنارتخته' , '73331');
// 			59 =  ('كوار' , '73461');
// 			60 =  ('گراش' , '7441');
// 			61 =  ('گويم' , '73491');
// 			62 =  ('لار ـ لارستان' , '7431');
// 			63 =  ('لامرد' , '74341');
// 			64 =  ('مبارك آباد' , '74731');
// 			65 =  ('مرودشت' , '7371');
// 			66 =  ('مشكان' , '74971');
// 			67 =  ('مصيري ـ رستم' , '73571');
// 			68 =  ('مظفري' , '71661');
// 			69 =  ('مهر' , '74451');
// 			70 =  ('ميمند' , '74741');
// 			71 =  ('نورآباد ـ ممسني' , '7351');
// 			72 =  ('ني ريز' , '7491');
// 			73 =  ('وراوي' , '73171');
// 		}
// 		if(state == 6)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ابريشم' , '81789');
// 			2 =  ('ابوزيدآباد' , '87481');
// 			3 =  ('اردستان' , '8381');
// 			4 =  ('اريسمان' , '87641');
// 			5 =  ('اژيه' , '83781');
// 			6 =  ('اسفرجان' , '8651');
// 			7 =  ('اسلام آباد' , '86481');
// 			8 =  ('اشن' , '85451');
// 			9 =  ('اصغرآباد' , '84351');
// 			10 =  ('اصفهان' , '81');
// 			11 =  ('امين آباد' , '86531');
// 			12 =  ('ايمان شهر' , '84651');
// 			13 =  ('آران وبيدگل' , '8741');
// 			14 =  ('بادرود' , '87661');
// 			15 =  ('باغ بهادران' , '84761');
// 			16 =  ('بهارستان' , '81431');
// 			17 =  ('بوئين ومياندشت' , '85651');
// 			18 =  ('پيربكران' , '84541');
// 			19 =  ('تودشك' , '81351');
// 			20 =  ('تيران' , '8531');
// 			21 =  ('جعفرآباد' , '84381');
// 			22 =  ('جندق' , '83631');
// 			23 =  ('جوجيل' , '84691');
// 			24 =  ('چادگان' , '8571');
// 			25 =  ('چرمهين' , '84751');
// 			26 =  ('چمگردان' , '84781');
// 			27 =  ('حسن اباد' , '83791');
// 			28 =  ('خالدآباد' , '87671');
// 			29 =  ('خميني شهر' , '841');
// 			30 =  ('خوانسار' , '8791');
// 			31 =  ('خوانسارك' , '84531');
// 			32 =  ('خور' , '8361');
// 			33 =  ('خوراسگان' , '81561');
// 			34 =  ('خورزوق' , '83451');
// 			35 =  ('داران ـ فريدن' , '8561');
// 			36 =  ('درچه پياز' , '8431');
// 			37 =  ('دستگردوبرخوار' , '83431');
// 			38 =  ('دهاقان' , '8641');
// 			39 =  ('دهق' , '8541');
// 			40 =  ('دولت آباد' , '8341');
// 			41 =  ('ديزيچه' , '84831');
// 			42 =  ('رزوه' , '85761');
// 			43 =  ('رضوان شهر' , '85331');
// 			44 =  ('رهنان' , '81879');
// 			45 =  ('زاينده رود' , '84931');
// 			46 =  ('زرين شهر ـ لنجان' , '8471');
// 			47 =  ('زواره' , '8441');
// 			48 =  ('زيار' , '81681');
// 			49 =  ('زيبا شهر' , '84841');
// 			50 =  ('سپاهان شهر' , '87992');
// 			51 =  ('سده لنجان' , '84741');
// 			52 =  ('سميرم' , '8661');
// 			53 =  ('شاهين شهر' , '831');
// 			54 =  ('شهرضا' , '861');
// 			55 =  ('شهرك صنعتي مورچ' , '83331');
// 			56 =  ('شهرك مجلسي' , '8631');
// 			57 =  ('شهرک صنعتي محمودآباد' , '8161');
// 			58 =  ('طالخونچه' , '84981');
// 			59 =  ('عسگران' , '85351');
// 			60 =  ('علويچه' , '8551');
// 			61 =  ('غرغن' , '85631');
// 			62 =  ('فرخي' , '83641');
// 			63 =  ('فريدون شهر' , '8591');
// 			64 =  ('فلاورجان' , '8451');
// 			65 =  ('فولادشهر' , '8491');
// 			66 =  ('فولادمباركه' , '84881');
// 			67 =  ('قهد ريجان' , '8461');
// 			68 =  ('كاشان' , '871');
// 			69 =  ('كليشادوسودرجان' , '84561');
// 			70 =  ('كمشچه' , '83591');
// 			71 =  ('كوهپايه' , '8371');
// 			72 =  ('گز' , '83441');
// 			73 =  ('گلپايگان' , '8771');
// 			74 =  ('گلدشت' , '85831');
// 			75 =  ('گلشهر' , '87841');
// 			76 =  ('گوگد' , '8781');
// 			77 =  ('مباركه' , '8481');
// 			78 =  ('مهاباد' , '84431');
// 			79 =  ('مورچه خورت' , '8331');
// 			80 =  ('ميمه' , '8351');
// 			81 =  ('نائين' , '8391');
// 			82 =  ('نجف آباد' , '851');
// 			83 =  ('نصر آباد' , '81751');
// 			84 =  ('نطنز' , '8761');
// 			85 =  ('نيك آباد' , '83771');
// 			86 =  ('بهارستان' , '81431');
// 			87 =  ('هرند' , '83741');
// 			88 =  ('ورزنه' , '83751');
// 			89 =  ('ورنامخواست' , '84731');
// 			90 =  ('ویلاشهر' , '8581');
// 		}
// 		if(state == 7)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ابدال آباد' , '95781');
// 			2 =  ('ازادوار' , '96441');
// 			3 =  ('باجگيران' , '94861');
// 			4 =  ('باخرز' , '95971');
// 			5 =  ('باسفر' , '95481');
// 			6 =  ('بجستان' , '96981');
// 			7 =  ('بردسكن' , '9681');
// 			8 =  ('برون' , '97741');
// 			9 =  ('بزنگان' , '93871');
// 			10 =  ('بند قرائ' , '96791');
// 			11 =  ('بيدخت' , '96941');
// 			12 =  ('تايباد' , '9591');
// 			13 =  ('تربت جام' , '9571');
// 			14 =  ('تربت حيدريه' , '951');
// 			15 =  ('جغتاي' , '9641');
// 			16 =  ('جنگل' , '95471');
// 			17 =  ('چمن آباد' , '95671');
// 			18 =  ('چناران' , '9361');
// 			19 =  ('خليل آباد' , '96771');
// 			20 =  ('خواف' , '9561');
// 			21 =  ('داورزن' , '9631');
// 			22 =  ('درگز' , '9491');
// 			23 =  ('دولت آباد ـ زاوه' , '95491');
// 			24 =  ('رادكان' , '93631');
// 			25 =  ('رشتخوار' , '9541');
// 			26 =  ('رضويه' , '91671');
// 			27 =  ('ريوش(كوهسرخ)' , '96741');
// 			28 =  ('سبزوار' , '961');
// 			29 =  ('سرخس' , '9381');
// 			30 =  ('سلطان آباد' , '96561');
// 			31 =  ('سنگان' , '95641');
// 			32 =  ('شانديز' , '93561');
// 			33 =  ('صالح آباد' , '9581');
// 			34 =  ('طرقبه ـ بينالود' , '9351');
// 			35 =  ('طوس سفلي' , '93571');
// 			36 =  ('فريمان' , '9391');
// 			37 =  ('فيروزه ـ تخت جلگه' , '9331');
// 			38 =  ('فيض آباد ـ مه ولات' , '9531');
// 			39 =  ('قاسم آباد' , '95661');
// 			40 =  ('قدمگاه' , '93461');
// 			41 =  ('قوچان' , '9471');
// 			42 =  ('كاخك' , '96961');
// 			43 =  ('كاشمر' , '9671');
// 			44 =  ('كلات' , '9371');
// 			45 =  ('گلبهار' , '93651');
// 			46 =  ('گناباد' , '9691');
// 			47 =  ('لطف آباد' , '94941');
// 			48 =  ('مشهد' , '91');
// 			49 =  ('مشهدريزه' , '95961');
// 			50 =  ('مصعبي' , '97761');
// 			51 =  ('نشتيفان' , '95631');
// 			52 =  ('نقاب ـ جوين' , '96471');
// 			53 =  ('نيشابور' , '931');
// 			54 =  ('نيل شهر' , '95751');
// 		}
// 		if(state == 8)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('َآوج' , '3461');
// 			2 =  ('ارداق' , '34671');
// 			3 =  ('اسفرورين' , '34561');
// 			4 =  ('اقباليه' , '34171');
// 			5 =  ('الوند ـ البرز' , '3431');
// 			6 =  ('آبگرم' , '34641');
// 			7 =  ('آبيك' , '3441');
// 			8 =  ('آقابابا' , '34791');
// 			9 =  ('بوئين زهرا' , '3451');
// 			10 =  ('بیدستان' , '34151');
// 			11 =  ('تاكستان' , '3481');
// 			12 =  ('حصاروليعصر' , '34691');
// 			13 =  ('خاكعلي' , '34481');
// 			14 =  ('خرم دشت' , '34831');
// 			15 =  ('دانسفهان' , '34581');
// 			16 =  ('سيردان' , '34741');
// 			17 =  ('شال' , '34571');
// 			18 =  ('شهر صنعتي البرز' , '3410');
// 			19 =  ('ضياآباد' , '34851');
// 			20 =  ('قزوين' , '341');
// 			21 =  ('ليا' , '34491');
// 			22 =  ('محمديه' , '3491');
// 			23 =  ('محمود آباد نمونه' , '34131');
// 			24 =  ('معلم كلايه' , '34931');
// 			25 =  ('نرجه' , '34811');
// 		}
// 		if(state == 9)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ارادان' , '35861');
// 			2 =  ('اميريه' , '3681');
// 			3 =  ('ايوانكي' , '3591');
// 			4 =  ('بسطام' , '3641');
// 			5 =  ('بيارجمند' , '3661');
// 			6 =  ('خيرآباد' , '35331');
// 			7 =  ('دامغان' , '3671');
// 			8 =  ('درجزين' , '35631');
// 			9 =  ('سرخه' , '3551');
// 			10 =  ('سمنان' , '351');
// 			11 =  ('شاهرود' , '361');
// 			12 =  ('شهميرزاد' , '3571');
// 			13 =  ('گرمسار' , '3581');
// 			14 =  ('مجن' , '3651');
// 			15 =  ('مهدي شهر' , '3561');
// 			16 =  ('ميامي' , '3631');
// 			17 =  ('ميغان' , '36441');
// 		}
// 		if(state == 10)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('دستجرد' , '3741');
// 			2 =  ('سلفچگان' , '37461');
// 			3 =  ('شهر جعفریه' , '37441');
// 			4 =  ('قم' , '371');
// 			5 =  ('قنوات' , '3731');
// 			6 =  ('كهك' , '37351');
// 		}
// 		if(state == 11)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اراك' , '381');
// 			2 =  ('آستانه' , '3871');
// 			3 =  ('آشتيان' , '3961');
// 			4 =  ('تفرش' , '3951');
// 			5 =  ('توره' , '38661');
// 			6 =  ('جاورسيان' , '38451');
// 			7 =  ('خسروبيك' , '38541');
// 			8 =  ('خشك رود' , '37761');
// 			9 =  ('خمين' , '3881');
// 			10 =  ('خنداب' , '3841');
// 			11 =  ('دليجان' , '3791');
// 			12 =  ('ريحان عليا' , '38941');
// 			13 =  ('زاويه' , '39441');
// 			14 =  ('ساوه' , '391');
// 			15 =  ('شازند' , '3861');
// 			16 =  ('شهراب' , '39541');
// 			17 =  ('شهرك مهاجران' , '3991');
// 			18 =  ('فرمهين' , '39531');
// 			19 =  ('كميجان' , '3851');
// 			20 =  ('مامونيه ـ زرنديه' , '3941');
// 			21 =  ('محلات' , '3781');
// 			22 =  ('ميلاجرد' , '38551');
// 			23 =  ('هندودر' , '38761');
// 		}
// 		if(state == 12)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  (' آب بر ـ طارم' , '4591');
// 			2 =  ('ابهر' , '4561');
// 			3 =  ('اسفجين' , '45371');
// 			4 =  ('پري' , '45431');
// 			5 =  ('حلب' , '45971');
// 			6 =  ('خرمدره' , '4571');
// 			7 =  ('دستجرده' , '45941');
// 			8 =  ('دندي' , '45471');
// 			9 =  ('زرين آباد ـ ايجرود' , '4531');
// 			10 =  ('زرين رود' , '45881');
// 			11 =  ('زنجان' , '451');
// 			12 =  ('سلطانيه' , '4551');
// 			13 =  ('صائين قلعه' , '45741');
// 			14 =  ('قيدار' , '4581');
// 			15 =  ('گرماب' , '45871');
// 			16 =  ('گيلوان' , '45931');
// 			17 =  ('ماهنشان' , '4541');
// 			18 =  ('همايون' , '45331');
// 			19 =  ('هيدج' , '45731');
// 		}
// 		if(state == 13)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اسلام آباد' , '48451');
// 			2 =  ('اميركلا' , '4731');
// 			3 =  ('ايزدشهر' , '46411');
// 			4 =  ('آمل' , '461');
// 			5 =  ('آهنگركلا' , '47341');
// 			6 =  ('بابل' , '471');
// 			7 =  ('بابلسر' , '4741');
// 			8 =  ('بلده' , '46471');
// 			9 =  ('بهشهر' , '4851');
// 			10 =  ('بهنمير' , '47441');
// 			11 =  ('پل سفيد ـ سوادكوه' , '4791');
// 			12 =  ('تنكابن' , '4681');
// 			13 =  ('جويبار' , '4771');
// 			14 =  ('چالوس' , '4661');
// 			15 =  ('چمستان' , '46431');
// 			16 =  ('خرم آباد' , '46851');
// 			17 =  ('خوشرودپی' , '47331');
// 			18 =  ('رامسر' , '4691');
// 			19 =  ('رستم كلا' , '48561');
// 			20 =  ('رويانشهر' , '46561');
// 			21 =  ('زاغمرز' , '48541');
// 			22 =  ('زرگر محله' , '47581');
// 			23 =  ('زيرآب' , '4781');
// 			24 =  ('سادات محله' , '46931');
// 			25 =  ('ساري' , '481');
// 			26 =  ('سرخرود' , '46341');
// 			27 =  ('سلمانشهر' , '4671');
// 			28 =  ('سنگده' , '48351');
// 			29 =  ('سوا' , '46371');
// 			30 =  ('سورك' , '48441');
// 			31 =  ('شيرگاه' , '47871');
// 			32 =  ('شيرود' , '46861');
// 			33 =  ('عباس آباد' , '46741');
// 			34 =  ('فريدون كنار' , '4751');
// 			35 =  ('قائم شهر' , '4761');
// 			36 =  ('كلارآباد' , '46731');
// 			37 =  ('كلاردشت' , '46661');
// 			38 =  ('كيا كلا' , '47731');
// 			39 =  ('كياسر' , '4831');
// 			40 =  ('گزنك' , '46391');
// 			41 =  ('گلوگاه' , '4861');
// 			42 =  ('گهرباران' , '48461');
// 			43 =  ('محمودآباد' , '4631');
// 			44 =  ('مرزن آباد' , '46641');
// 			45 =  ('مرزي كلا' , '47561');
// 			46 =  ('نشتارود' , '46831');
// 			47 =  ('نكاء' , '4841');
// 			48 =  ('نور' , '4641');
// 			49 =  ('نوشهر' , '4651');
// 		}
// 		if(state == 14)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('انبار آلوم' , '49391');
// 			2 =  ('اينچه برون' , '49751');
// 			3 =  ('آزادشهر' , '4961');
// 			4 =  ('آق قلا' , '4931');
// 			5 =  ('بندر گز' , '4871');
// 			6 =  ('بندرتركمن' , '4891');
// 			7 =  ('جلين' , '49351');
// 			8 =  ('خان ببين' , '49531');
// 			9 =  ('راميان' , '4951');
// 			10 =  ('سيمين شهر' , '48971');
// 			11 =  ('علي آباد' , '4941');
// 			12 =  ('فاضل آباد' , '49431');
// 			13 =  ('كردكوي' , '4881');
// 			14 =  ('كلاله' , '4991');
// 			15 =  ('گاليكش' , '49831');
// 			16 =  ('گرگان' , '491');
// 			17 =  ('گميش تپه' , '48961');
// 			18 =  ('گنبدكاوس' , '4971');
// 			19 =  ('مراوه تپه' , '48733');
// 			20 =  ('مينودشت' , '4981');
// 		}
// 		if(state == 15)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ابي بيگلو' , '56331');
// 			2 =  ('اردبيل' , '561');
// 			3 =  ('اصلاندوز' , '56981');
// 			4 =  ('بيله سوار' , '5671');
// 			5 =  ('پارس آباد' , '5691');
// 			6 =  ('تازه كند انگوت' , '56581');
// 			7 =  ('جعفرآباد' , '56751');
// 			8 =  ('خلخال' , '5681');
// 			9 =  ('سرعين' , '56391');
// 			10 =  ('شهرك شهيد غفاري' , '56971');
// 			11 =  ('كلور' , '56891');
// 			12 =  ('كوارئيم' , '56431');
// 			13 =  ('گرمي ' , '5651');
// 			14 =  ('گيوي ـ كوثر' , '56851');
// 			15 =  ('لاهرود' , '56653');
// 			16 =  ('مشگين شهر' , '5661');
// 			17 =  ('نمين' , '5631');
// 			18 =  ('نير' , '5641');
// 			19 =  ('هشتجين' , '56871');
// 		}
// 		if(state == 16)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اروميه' , '571');
// 			2 =  ('اشنويه' , '5771');
// 			3 =  ('ايواوغلي' , '5831');
// 			4 =  ('بازرگان' , '58671');
// 			5 =  ('بوكان' , '5951');
// 			6 =  ('پسوه' , '57951');
// 			7 =  ('پلدشت' , '58771');
// 			8 =  ('پيرانشهر' , '5781');
// 			9 =  ('تازه شهر' , '5891');
// 			10 =  ('تكاب' , '5991');
// 			11 =  ('چهاربرج قديم' , '59771');
// 			12 =  ('خوي' , '581');
// 			13 =  ('ديزج' , '57451');
// 			14 =  ('ديزجديز' , '5837');
// 			15 =  ('ربط' , '59691');
// 			16 =  ('زيوه' , '57461');
// 			17 =  ('سردشت' , '5961');
// 			18 =  ('سلماس' , '5881');
// 			19 =  ('سيلوانا' , '57411');
// 			20 =  ('سيلوه' , '573');
// 			21 =  ('سيه چشمه ـ چالدران' , '5871');
// 			22 =  ('شاهين دژ' , '5981');
// 			23 =  ('شوط' , '58751');
// 			24 =  ('قره ضياء الدين ـ چايپاره' , '5851');
// 			25 =  ('قوشچي' , '5751');
// 			26 =  ('كشاورز (اقبال)' , '59731');
// 			27 =  ('ماكو' , '5861');
// 			28 =  ('محمد يار' , '57661');
// 			29 =  ('محمودآباد' , '59861');
// 			30 =  ('مهاباد' , '591');
// 			31 =  ('مياندوآب' , '5971');
// 			32 =  ('مياوق' , '57351');
// 			33 =  ('ميرآباد' , '59671');
// 			34 =  ('نقده' , '5761');
// 			35 =  ('نوشين شهر' , '57381');
// 		}
// 		if(state == 17)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ازندريان' , '65995');
// 			2 =  ('اسدآباد' , '6541');
// 			3 =  ('اسلام آباد' , '65791');
// 			4 =  ('بهار' , '6531');
// 			5 =  ('پايگاه نوژه' , '65992');
// 			6 =  ('تويسركان' , '6581');
// 			7 =  ('دمق' , '65671');
// 			8 =  ('رزن' , '65681');
// 			9 =  ('سامن' , '65761');
// 			10 =  ('سركان' , '65841');
// 			11 =  ('شيرين سو' , '65571');
// 			12 =  ('صالح آباد' , '65361');
// 			13 =  ('فامنين' , '6561');
// 			14 =  ('قروه درجزين' , '65691');
// 			15 =  ('قهاوند' , '65631');
// 			16 =  ('كبودرآهنگ' , '6551');
// 			17 =  ('گيان' , '65961');
// 			18 =  ('لالجين' , '65331');
// 			19 =  ('ملاير' , '6571');
// 			20 =  ('نهاوند' , '6591');
// 			21 =  ('همدان' , '651');
// 		}
// 		if(state == 18)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اورامانتخت' , '66791');
// 			2 =  ('بانه' , '6691');
// 			3 =  ('بلبان آباد' , '66661');
// 			4 =  ('بيجار' , '6651');
// 			5 =  ('دلبران' , '66631');
// 			6 =  ('دهگلان' , '66671');
// 			7 =  ('ديواندره' , '6641');
// 			8 =  ('سروآباد' , '66781');
// 			9 =  ('سريش آباد' , '66691');
// 			10 =  ('سقز' , '6681');
// 			11 =  ('سنندج' , '661');
// 			12 =  ('قروه' , '6661');
// 			13 =  ('كامياران' , '6631');
// 			14 =  ('مريوان' , '6671');
// 			15 =  ('موچش' , '66391');
// 		}
// 		if(state == 19)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اسلام آباد غرب' , '6761');
// 			2 =  ('باينگان' , '67931');
// 			3 =  ('بيستون' , '67371');
// 			4 =  ('پاوه' , '6791');
// 			5 =  ('تازه آباد ـ ثلاث باباجاني' , '67771');
// 			6 =  ('جوانرود' , '67981');
// 			7 =  ('روانسر' , '67961');
// 			8 =  ('ريجاب' , '67651');
// 			9 =  ('سراب ذهاب' , '67741');
// 			10 =  ('سرپل ذهاب' , '6771');
// 			11 =  ('سنقر' , '6751');
// 			12 =  ('صحنه' , '67461');
// 			13 =  ('فرامان' , '67441');
// 			14 =  ('فش' , '67431');
// 			15 =  ('قصرشيرين' , '6781');
// 			16 =  ('كرمانشاه' , '671');
// 			17 =  ('كنگاور' , '6741');
// 			18 =  ('گيلانغرب' , '67871');
// 			19 =  ('نودشه' , '67951');
// 			20 =  ('هرسين' , '6731');
// 			21 =  ('هلشي' , '67341');
// 		}
// 		if(state == 20)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ازنا' , '6871');
// 			2 =  ('الشتر ـ سلسله' , '6891');
// 			3 =  ('اليگودرز' , '6861');
// 			4 =  ('برخوردار' , '68331');
// 			5 =  ('بروجرد' , '691');
// 			6 =  ('پل دختر' , '6851');
// 			7 =  ('تقي آباد' , '68391');
// 			8 =  ('چغلوندی' , '68181');
// 			9 =  ('چقابل' , '68451');
// 			10 =  ('خرم آباد' , '681');
// 			11 =  ('دورود' , '6881');
// 			12 =  ('زاغه' , '68761');
// 			13 =  ('سپيددشت' , '68861');
// 			14 =  ('شول آباد' , '68671');
// 			15 =  ('كوناني' , '68471');
// 			16 =  ('كوهدشت' , '6841');
// 			17 =  ('معمولان' , '68571');
// 			18 =  ('نورآباد ـ دلفان' , '6831');
// 			19 =  ('واشيان نصيرتپه' , '68541');
// 		}
// 		if(state == 21)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ابدان' , '75551');
// 			2 =  ('اهرم ـ تنگستان' , '7551');
// 			3 =  ('آباد' , '75491');
// 			4 =  ('آبپخش' , '75651');
// 			5 =  ('بادوله' , '75431');
// 			6 =  ('برازجان ـ دشتستان' , '7561');
// 			7 =  ('بردخون' , '75531');
// 			8 =  ('بندردير' , '75541');
// 			9 =  ('بندرديلم' , '75361');
// 			10 =  ('بندرريگ' , '75331');
// 			11 =  ('بندركنگان' , '75571');
// 			12 =  ('بندرگناوه' , '7531');
// 			13 =  ('بوشهر' , '751');
// 			14 =  ('تنگ ارم' , '75681');
// 			15 =  ('جزيره خارك' , '75461');
// 			16 =  ('جم' , '75581');
// 			17 =  ('چغارك' , '75381');
// 			18 =  ('خورموج ـ دشتي' , '7541');
// 			19 =  ('دلوار' , '75471');
// 			20 =  ('ريز' , '75561');
// 			21 =  ('سعدآباد' , '75661');
// 			22 =  ('شبانكاره' , '75641');
// 			23 =  ('شنبه' , '75441');
// 			24 =  ('شول' , '75351');
// 			25 =  ('عالی شهر' , '75196');
// 			26 =  ('عسلويه' , '75391');
// 			27 =  ('كاكي' , '75451');
// 			28 =  ('كلمه' , '75691');
// 			29 =  ('نخل تقي' , '75111');
// 			30 =  ('وحدتيه' , '75671');
// 		}
// 		if(state == 22)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اختيارآباد' , '76381');
// 			2 =  ('ارزوئیه' , '78591');
// 			3 =  ('امين شهر' , '77431');
// 			4 =  ('انار' , '7741');
// 			5 =  ('باغين' , '76371');
// 			6 =  ('بافت' , '7851');
// 			7 =  ('بردسير' , '7841');
// 			8 =  ('بلوك' , '78791');
// 			9 =  ('بم' , '7661');
// 			10 =  ('بهرمان' , '77461');
// 			11 =  ('پاريز' , '7831');
// 			12 =  ('جواديه فلاح' , '77471');
// 			13 =  ('جوشان' , '76431');
// 			14 =  ('جيرفت' , '7861');
// 			15 =  ('چترود' , '7791');
// 			16 =  ('خانوك' , '77761');
// 			17 =  ('دوساري' , '78771');
// 			18 =  ('رابر' , '78561');
// 			19 =  ('راور' , '7651');
// 			20 =  ('راين' , '7681');
// 			21 =  ('رفسنجان' , '771');
// 			22 =  ('رودبار' , '78831');
// 			23 =  ('ريگان' , '76761');
// 			24 =  ('زرند' , '7761');
// 			25 =  ('زنگي آباد' , '76391');
// 			26 =  ('سرچشمه' , '7731');
// 			27 =  ('سريز' , '77751');
// 			28 =  ('سيرجان' , '781');
// 			29 =  ('شهربابك' , '7751');
// 			30 =  ('صفائيه' , '77391');
// 			31 =  ('عنبرآباد' , '7871');
// 			32 =  ('فارياب' , '78871');
// 			33 =  ('فهرج' , '76741');
// 			34 =  ('قلعه گنج' , '78841');
// 			35 =  ('كاظم آباد' , '77951');
// 			36 =  ('كرمان' , '761');
// 			37 =  ('كهنوج' , '7881');
// 			38 =  ('كهنوج( مغزآباد)' , '77941');
// 			39 =  ('كوهبنان' , '7781');
// 			40 =  ('كيان شهر' , '7771');
// 			41 =  ('گلباف' , '7641');
// 			42 =  ('ماهان' , '7631');
// 			43 =  ('محمدآباد ـ ريگان' , '7691');
// 			44 =  ('محي آباد' , '76891');
// 			45 =  ('منوجان' , '7891');
// 			46 =  ('نجف شهر' , '78151');
// 			47 =  ('نگار' , '78431');
// 		}
// 		if(state == 23)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ابوموسي' , '79591');
// 			2 =  ('ايسين' , '79331');
// 			3 =  ('بستك' , '7961');
// 			4 =  ('بندرخمير' , '7931');
// 			5 =  ('بندرعباس' , '791');
// 			6 =  ('بندرلنگه' , '7971');
// 			7 =  ('بندزك كهنه' , '79981');
// 			8 =  ('پارسيان' , '79771');
// 			9 =  ('پدل' , '79631');
// 			10 =  ('پل شرقي' , '79341');
// 			11 =  ('تياب' , '79971');
// 			12 =  ('جاسك' , '79791');
// 			13 =  ('جزيره سيري' , '79581');
// 			14 =  ('جزيره لاوان' , '79781');
// 			15 =  ('جزيره هنگام' , '79571');
// 			16 =  ('جزيرهلارك' , '79561');
// 			17 =  ('جناح' , '79611');
// 			18 =  ('چارك' , '79751');
// 			19 =  ('حاجي آباد' , '79391');
// 			20 =  ('درگهان' , '79531');
// 			21 =  ('دشتي' , '79761');
// 			22 =  ('دهبارز ـ رودان' , '7991');
// 			23 =  ('رويدر' , '79661');
// 			24 =  ('زيارت علي' , '79941');
// 			25 =  ('سردشت ـ بشاگرد' , '79881');
// 			26 =  ('سندرك' , '79841');
// 			27 =  ('سيريك' , '79461');
// 			28 =  ('فارغان' , '79371');
// 			29 =  ('فين' , '79351');
// 			30 =  ('قشم' , '7951');
// 			31 =  ('كنگ' , '79641');
// 			32 =  ('كيش' , '7941');
// 			33 =  ('ميناب' , '7981');
// 		}
// 		if(state == 24)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اردل' , '8881');
// 			2 =  ('آلوني' , '88941');
// 			3 =  ('باباحيدر' , '88631');
// 			4 =  ('بروجن' , '8871');
// 			5 =  ('بلداجي' , '88761');
// 			6 =  ('بن' , '88581');
// 			7 =  ('جونقان' , '88671');
// 			8 =  ('چالشتر' , '88471');
// 			9 =  ('چلگرد ـ كوهرنگ' , '88651');
// 			10 =  ('دزك' , '8834');
// 			11 =  ('دستنائ' , '88361');
// 			12 =  ('دشتك' , '88881');
// 			13 =  ('سامان' , '8851');
// 			14 =  ('سودجان' , '88461');
// 			15 =  ('سورشجان' , '88431');
// 			16 =  ('شلمزار ـ كيار' , '88371');
// 			17 =  ('شهركرد' , '881');
// 			18 =  ('فارسان' , '8861');
// 			19 =  ('فرادنبه' , '88741');
// 			20 =  ('فرخ شهر' , '8831');
// 			21 =  ('كیان' , '88139');
// 			22 =  ('گندمان' , '88781');
// 			23 =  ('گهرو' , '88381');
// 			24 =  ('لردگان' , '8891');
// 			25 =  ('مال خليفه' , '88951');
// 			26 =  ('ناغان' , '88831');
// 			27 =  ('هاروني' , '8844');
// 			28 =  ('هفشجان' , '8841');
// 			29 =  ('وردنجان' , '88571');
// 		}
// 		if(state == 25)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ابركوه' , '8931');
// 			2 =  ('احمدآباد' , '89531');
// 			3 =  ('اردكان' , '8951');
// 			4 =  ('بافق' , '8971');
// 			5 =  ('بفروئيه' , '89631');
// 			6 =  ('بهاباد' , '89761');
// 			7 =  ('تفت' , '8991');
// 			8 =  ('حميديا' , '89491');
// 			9 =  ('زارچ' , '89418');
// 			10 =  ('شاهديه' , '89431');
// 			11 =  ('صدوق' , '8941');
// 			12 =  ('طبس' , '9791');
// 			13 =  ('عشق آباد' , '97981');
// 			14 =  ('فراغه' , '89331');
// 			15 =  ('مروست' , '89871');
// 			16 =  ('مهريز' , '8981');
// 			17 =  ('ميبد' , '8961');
// 			18 =  ('نير' , '89961');
// 			19 =  ('هرات ـ خاتم' , '89881');
// 			20 =  ('يزد' , '891');
// 		}
// 		if(state == 26)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اسپكه' , '99431');
// 			2 =  ('ايرانشهر' , '991');
// 			3 =  ('بزمان' , '99491');
// 			4 =  ('بمپور' , '9941');
// 			5 =  ('بنت' , '99451');
// 			6 =  ('بنجار' , '98691');
// 			7 =  ('پسكو' , '99641');
// 			8 =  ('تيموراباد' , '98641');
// 			9 =  ('جالق' , '99561');
// 			10 =  ('چابهار' , '9971');
// 			11 =  ('خاش' , '9891');
// 			12 =  ('دوست محمد ـ هيرمند' , '9851');
// 			13 =  ('راسك' , '99361');
// 			14 =  ('زابل' , '9861');
// 			15 =  ('زابلي' , '99661');
// 			16 =  ('زاهدان' , '981');
// 			17 =  ('زهك' , '9871');
// 			18 =  ('ساربوك' , '99991');
// 			19 =  ('سراوان' , '9951');
// 			20 =  ('سرباز' , '9931');
// 			21 =  ('سنگان' , '98971');
// 			22 =  ('سوران ـ سيب سوران' , '9961');
// 			23 =  ('سيركان' , '99571');
// 			24 =  ('فنوج' , '99461');
// 			25 =  ('قصرقند' , '99961');
// 			26 =  ('كنارك' , '9981');
// 			27 =  ('كيتج' , '99881');
// 			28 =  ('گلمورتي ـ دلگان' , '99471');
// 			29 =  ('گوهركوه' , '98931');
// 			30 =  ('محمدآباد' , '98681');
// 			31 =  ('ميرجاوه' , '9841');
// 			32 =  ('نصرت آباد' , '9831');
// 			33 =  ('نگور' , '99761');
// 			34 =  ('نيك شهر' , '9991');
// 			35 =  ('هيدوچ' , '99671');
// 		}
// 		if(state == 27)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اركواز' , '69971');
// 			2 =  ('ارمو' , '69641');
// 			3 =  ('ايلام' , '6931');
// 			4 =  ('ايوان' , '6941');
// 			5 =  ('آبدانان' , '6971');
// 			6 =  ('آسمان آباد' , '69561');
// 			7 =  ('بدره' , '69671');
// 			8 =  ('توحيد' , '69531');
// 			9 =  ('چشمه شيرين' , '69661');
// 			10 =  ('چوار' , '69361');
// 			11 =  ('دره شهر' , '6961');
// 			12 =  ('دهلران' , '6981');
// 			13 =  ('سرابله ـ شيروان و چرداول' , '6951');
// 			14 =  ('شباب ' , '69511');
// 			15 =  ('شهرك اسلاميه' , '69931');
// 			16 =  ('لومار' , '69551');
// 			17 =  ('مهران' , '6991');
// 			18 =  ('موسيان' , '69841');
// 			19 =  ('ميمه' , '69861');
// 		}
// 		if(state == 28)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('باشت' , '75881');
// 			2 =  ('پاتاوه' , '75981');
// 			3 =  ('چرام' , '75761');
// 			4 =  ('دهدشت ـ كهگيلويه' , '7571');
// 			5 =  ('دوگنبدان ـ گچساران' , '7581');
// 			6 =  ('ديشموك' , '75771');
// 			7 =  ('سپيدار' , '75931');
// 			8 =  ('سوق' , '75731');
// 			9 =  ('سي سخت ـ دنا' , '75991');
// 			10 =  ('قلعه رئيسي' , '75781');
// 			11 =  ('لنده' , '75741');
// 			12 =  ('ليكك' , '75751');
// 			13 =  ('مادوان' , '75911');
// 			14 =  ('ياسوج ـ 7591' , '7591');
// 		}
// 		if(state == 29)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اسفراين' , '9661');
// 			2 =  ('ايور' , '94331');
// 			3 =  ('آشخانه ـ مانه و سلمقان' , '9451');
// 			4 =  ('بجنورد' , '941');
// 			5 =  ('جاجرم' , '9441');
// 			6 =  ('درق' , '94311');
// 			7 =  ('راز' , '94561');
// 			8 =  ('شوقان' , '94471');
// 			9 =  ('شيروان' , '9461');
// 			10 =  ('فاروج' , '9481');
// 			11 =  ('گرمه' , '9431');
// 		}
// 		if(state == 30)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('ارسك' , '97831');
// 			2 =  ('اسديه ـ درميان' , '97441');
// 			3 =  ('آرين شهر' , '97631');
// 			4 =  ('آيسك' , '97791');
// 			5 =  ('بشرويه' , '9781');
// 			6 =  ('بیرجند' , '971');
// 			7 =  ('حاجي آباد' , '97671');
// 			8 =  ('خضري دشت بياض' , '97661');
// 			9 =  ('خوسف' , '97351');
// 			10 =  ('زهان' , '97691');
// 			11 =  ('سر بیشه' , '9741');
// 			12 =  ('سرايان' , '97771');
// 			13 =  ('سه قلعه' , '97891');
// 			14 =  ('فردوس' , '9771');
// 			15 =  ('قائن ـ قائنات' , '9761');
// 			16 =  ('گزيک' , '97461');
// 			17 =  ('مود' , '97311');
// 			18 =  ('نهبندان' , '9751');
// 			19 =  ('نیمبلوك' , '97443');
// 		}
// 		if(state == 31)
// 		{
// 			0 =  ('لطفا شهر را انتخاب نمایید' , '0');
// 			1 =  ('اشتهارد' , '31871');
// 			2 =  ('آسارا' , '31551');
// 			3 =  ('چهارباغ' , '33661');
// 			4 =  ('سيف آباد' , '33611');
// 			5 =  ('شهر جديد هشتگرد' , '33618');
// 			6 =  ('طالقان' , '33691');
// 			7 =  ('كرج' , '31');
// 			8 =  ('كمال شهر' , '31991');
// 			9 =  ('كوهسار ـ چندار' , '33651');
// 			10 =  ('گرمدره' , '31638');
// 			11 =  ('ماهدشت' , '31849');
// 			12 =  ('محمدشهر' , '31778');
// 			13 =  ('مشکين دشت' , '31776');
// 			14 =  ('نظرآباد' , '3331');
// 			15 =  ('هشتگرد ـ ساوجبلاغ' , '3361');
// 		}
// 	}
// }