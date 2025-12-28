import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const artists = [
  {
    name: "Ricky Ricardo",
    slug: "ricky-ricardo",
    hero_image: "/artists/ricky-ricardo.jpg",
    bio:
      "Ricky Ricardo brings unmatched energy to the stage with his fierce delivery and conscious lyrics. A true rebel artist, his music channels the spirit of resistance and empowerment. Blending roots reggae with sharp commentary and streetwise charisma, Ricky creates soundscapes that speak truth to power. Whether in the studio or live, he ignites the crowd with passion and purpose.",
  },
  {
    name: "Elli Hekima",
    slug: "eli-hakema",
    hero_image: "/artists/eli-hakema.jpg",
    bio:
      "Elli Hekima, born Omar Facey and formerly known by the stage name Pampi Judah, is a gifted Jamaican artist with an extensive and impressive musical journey. Born in St. Thomas and raised in August Town, St. Andrews, Elli has always seen music as the perfect medium to showcase his extraordinary talent. From his humble beginnings singing in church and performing at community talent shows, Elli discovered his innate ability to captivate audiences with his musical flair.\n\nAt the age of 19, encouraged by a mentor, he sought out studios to bring his talent to the forefront. This pursuit led him to collaborate with reggae musicians like Christopher Meredith and Geoffrey Star, the studio engineer of Bust Out Studio. He also had the privilege of working with Michigan from the renowned duo Michigan & Smiley. Michigan not only recognized Elli's potential but also became his producer and mentor.\n\nElli released his first song, \"So in Love,\" under Michigan's guidance, which marked the beginning of a fruitful collaboration that led to numerous releases. In 2004, Eli expanded his horizons and toured internationally, performing alongside legends such as Gregory Isaacs, John Holt, and Dean Fraser, showcasing his talent in Canada, Europe, and Jamaica.\n\nA member of the Twelve Tribes of Israel, Elli returned to his roots by joining the group Orthodox Family, where he performed alongside artists like Israel Voice, Ras Negus I, and Natural Black. Eli continued his musical journey with Natural Black, performing across Jamaica, the Caribbean, and Europe.\n\nIn 2014, Elli embarked on a new chapter by relocating to Tanzania, where he adopted the name Elli Hekima. Embracing the African music scene, he collaborated with celebrated local artists, including Davan Trappe, Chindo Man, Fido Vato, Mex Cortez, P Kulcha, Chaba, and Stopa Rhymes. Elli's adaptability and creative versatility earned him recognition in Tanzania's music industry and enabled him to perform in Kenya, Namibia, South Africa, and beyond.\n\nElli Hekima is an artist of exceptional talent and range, balancing his musical pursuits with a deep spiritual connection. He creates music that resonates with Africa and the world, a testament to his dedication and passion for his craft. His journey, marked by artistic evolution and international acclaim, solidifies his place as a versatile and impactful figure in the global music industry.",
  },
  {
    name: "Me Ca Melody",
    slug: "me-ca-melody",
    hero_image: "/artists/me-ca-melody.jpg",
    bio:
      "My name is Michelle Johnson, also known as Me Ca Melody. I was born and raised in Croydon, London. My musical journey began in the Pentecostal church, where I sang in the choir and became one of its lead vocalists by the age of 14. At 16, I joined a group called Reefer Madness with a college friend, Joel Reefer, who continues to produce music today.\n\nWe were discovered by Frederick Hook, drummer for The Pretenders, who invited us to his studio in Streatham. It was a humble setup, a four-track studio in a van, but it is where we learned to compose using a basic keyboard, 808 drum machine, and that four-track recorder. This hands-on experience taught me how to craft original songs, develop harmonies, and refine my unique vocal style.\n\nOne of our tracks made it onto the soundtrack of a Japanese film called The 90 Days. I was later offered a contract by Island Records, but I turned it down, feeling I was not yet ready to go solo, a decision that became a valuable lesson in timing and opportunity.\n\nOver the years, I have entered various talent shows including Hackney Empire's 291 Club, Tony Lee Singers Promotions, Singers Paradise, and Bionic Rona's Talent Search in Battersea. That is where I met Bionic Rona, who became a mentor and introduced me to Papa Levi. He invited me to collaborate on a track called Physical. I wrote and recorded vocals he was happy to use.\n\nI have also performed in several groups: a girl band called Infinity, a jazz group named Soda, and worked with Merlin, nephew of Smiley Culture. After taking time out to raise my son, I returned to music and joined the Mystical Roots Warrior label. I was introduced to Marky Roots by his brother, and we have since recorded an album awaiting release. I have also recently contributed backing vocals to two tracks on Ricky Ranking's upcoming album.",
  },
  {
    name: "Jah Mirikle",
    slug: "jah-mirikle",
    hero_image: "/artists/jah-mirikle.jpg",
    bio:
      "Jah Mirikle channels spiritual frequencies into his music. With chants of healing, consciousness, and strength, his songs are anthems for resilience and Rastafari truth. Rooted in reggae tradition but driven by a revolutionary spirit, Jah Mirikle uses sound to awaken the soul and inspire action. Whether on stage or in the studio, he delivers messages that move hearts and shift energies.",
  },
  {
    name: "Ezy Star",
    slug: "ezy-star",
    hero_image: "/artists/ezy-star.jpg",
    bio:
      "Ezy Star, aka Ezra Smith, was born on the 20th of September 19??. At an exceedingly early age, I wanted to be a singer. But unfortunately, I had a severe speech problem. I stammer when I tried to speak but I always wanted to sing. Fortunately my stammering did not affect my singing for some reason. I was very shy, so I used to hide and sing. My singing career started in the early 80s at the age of 24. I teamed up with a friend and a family of mine who goes by the name of Joe Parks. We had a few tunes, but I was not consistent with my music career. My music had been played by the best reggae DJs of those times, i.e. David Rodigan, Tony Williams, and later times DJs like Daddy Earnie, also top pirate stations. I had memorable appearances on shows like appearing on the same stage as the legendary John Holt in Harlesden. Frankie Paul in Brixton appeared amongst most of the great British artists at the podium in Vauxhall.\n\nIn this present time, I have teamed up with David Knotts aka David Neblett and Marky Roots aka Mark Hutson. We are working together at the present time building reggae beats, writing songs, and producing music on the Mystical Roots Warrior label. Also, with Daddy Noddy on the Yush label. Also, I teamed up with Legal aka Lee Creary. We are in the process of building a rub a dub album involving some covers of other songs. I have finally become serious about my music career. I am going to have a good go with the best of my abilities and hoping that it will be enjoyed by the public. Peace, love, oneness.",
  },
  {
    name: "Shaii",
    slug: "shaii",
    hero_image: "/artists/shaii.jpg",
    bio:
      "Shaii (Sharon Peters) was born in Bermondsey and raised in Deptford, attending school in New Cross. She is loyal, fun-loving, and dependable. At 15 she was first stopped and signed up for 15 years by Venture Records and made her first lover's rock record called Bad News. For writing her music, she only needs to hear music and the lyrics just come. At age 10, she would have told herself, come on, you can go it. You are strong. You are a survivor.",
  },
  {
    name: "David Knotts",
    slug: "david-knotts",
    hero_image: "/artists/david-knotts.jpg",
    bio:
      "David Knotts is a visionary reggae artist and co-founder of Mystical Roots Warrior. With over 35 years of music production experience, David blends grassroots authenticity with spiritual depth. His mission is to build platforms for others, using music as a force of empowerment and unity. From bedroom sessions to stage performances, David brings a conscious energy that resonates across generations.",
  },
  {
    name: "Marky Roots",
    slug: "marky-roots",
    hero_image: "/artists/marky-roots.jpg",
    bio:
      "Marky Roots, co-founder of Mystical Roots Warrior, has always carried the mission of unity and upliftment through music. Growing up in South London with reggae running through his veins, he blended urban realities with ancestral echoes to create soundscapes that are both grounded and divine.\n\nKnown for his powerful rhythms and roots-heavy productions, Marky's beats are the foundation on which many MRW tracks are built. His dedication behind the scenes as a producer, engineer, and creative guide has helped shape the direction of the collective and elevate the voice of the community.\n\nMore than an artist, Marky is a movement architect. With collaborations reaching into Channel One Sound System, Barry Issacs, and the Twinkle Brothers network, his impact is felt both musically and culturally. He continues to drive Mystical Roots Warrior as a platform for truth, spiritual resistance, and authentic roots revival.",
  },
  {
    name: "General",
    slug: "general",
    hero_image: "/artists/general.jpg",
    bio: "Bio coming soon.",
  },
  {
    name: "Melody Ca",
    slug: "melody-ca",
    hero_image: "/artists/melody-ca.jpg",
    bio: "Bio coming soon.",
  },
];

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;

  const artist = artists.find((entry) => entry.slug === slug);

  if (!artist) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {artist.hero_image && (
            <div className="w-full md:w-auto">
              <div className="relative w-full md:w-[600px] h-[320px] md:h-[600px] bg-neutral-900 overflow-hidden">
                <img
                  src={artist.hero_image}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-4">
            <h1 className="text-2xl md:text-3xl uppercase tracking-widest">
              {artist.name}
            </h1>

            {artist.bio && (
              <p className="leading-relaxed text-sm sm:text-base opacity-80 whitespace-pre-line">
                {artist.bio}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
