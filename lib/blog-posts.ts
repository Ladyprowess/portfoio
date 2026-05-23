export type BlogBlock =
  | {
      type: 'paragraph'
      text: string
    }
  | {
      type: 'quote'
      text: string
    }
  | {
      type: 'divider'
    }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  accent: string
  body: BlogBlock[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'from-a-phone-screen-to-a-movement',
    title: 'From a Phone Screen to a Movement: The Story of Lady Prowess',
    excerpt:
      'The story of Ngozi Peace Okafor, known as Lady Prowess, and the writing journey that grew from a phone screen into strategy, business, and technology.',
    category: 'Personal Story',
    date: 'May 2026',
    readTime: '8 min read',
    accent: '#41d7c7',
    body: [
      {
        type: 'quote',
        text: `Her story does not begin with a business plan or a mentor or a scholarship. It begins with a phone, a quiet love for words, and a girl who simply could not stop writing.`,
      },
      {
        type: 'paragraph',
        text: `There are people who find their calling late in life, after years of searching, after failed attempts and long detours. And then there are people who were always it. They just had to survive long enough to become it fully. Ngozi Peace Okafor, known across digital spaces as Lady Prowess, is the second kind of person.`,
      },
      {
        type: 'paragraph',
        text: `In 2016, Ngozi started writing. Not for money. Not for an audience. Just because she wanted to. She was writing on her phone, putting words together the way some people hum to themselves, naturally, almost without thinking. That same year, she gained admission into the University of Uyo. A new city, a new environment, and as luck or destiny would have it, the people she found herself around were already thinking about technology. She did not know at the time how much that would matter.`,
      },
      {
        type: 'paragraph',
        text: `But university brought its own pressure. She was a student who needed to take care of herself, and nobody was going to hand her that. So she did what she knew how to do. She wrote. She started writing assignments for other students. Seminar papers. Workshop documents. Projects. Whatever they needed put together in words, she was the one they came to. And they paid her for it. It was quiet, unglamorous work. There was nothing inspiring about it on the surface. But it kept her alive in school. It kept food within reach and kept her standing when things were tight. And somehow, through all of it, she never stopped loving the craft itself. She was not just writing to survive. She was surviving through the one thing that had always felt like hers.`,
      },
      {
        type: 'paragraph',
        text: `By August 2017, someone decided her writing was worth paying for beyond favours. She landed her first paid writing role, producing content for a blog. The pay was five thousand naira every month. The workload was five posts every single day, Monday to Saturday. If you sit with those numbers for a moment, you will understand just how much she was giving for how little she was getting back. But she showed up. Every day. Not because five thousand naira was enough. It was not even close. She showed up because she loved it. That kind of love is not rational. It does not calculate. It just keeps going.`,
      },
      {
        type: 'paragraph',
        text: `Around that same time, she discovered TrueLancer, a freelancing platform where writers could earn in foreign currency. She created an account and started writing. Then she hit a wall she could not break through. Withdrawing the money she had earned was nearly impossible. PayPal had already blocked Nigeria. Payoneer felt out of reach. The system simply was not built with someone like her in mind. She paused. She had no choice. But she did not disappear.`,
      },
      { type: 'divider' },
      {
        type: 'paragraph',
        text: `In 2018, a friend she calls Hero, whose name is Israel, sat with her and showed her something new. Web development. She started with WordPress, learning how to build websites from the ground up. Then she kept going. HTML. CSS. JavaScript. PHP. She was not in a classroom or a bootcamp. She was in a cyber cafe called Nafias, going there after school, sitting among people who were already deep in tech, absorbing everything around her. That place shaped her in ways she probably did not fully realise at the time. The minds she met there pushed her further. She was building skills quietly, with no guarantee they would ever pay off, but she kept going anyway. That is the thread running through her entire story. She just kept going.`,
      },
      {
        type: 'paragraph',
        text: `In 2019, while still in school, still writing for other students, still learning to code, she added something else. She started selling hair growth products. And it worked. The business was profitable. She was making real money, managing customers, building something with her own hands. For a period, it felt like things were finally opening up. Then the market turned on her. Fake versions of the products started circulating, and customers began complaining. She could not control what was happening outside of her. She had to stop. Something she had built from nothing was suddenly gone, and there was nothing she could do about it. That kind of loss is its own kind of grief. But Ngozi did not collapse. She kept moving.`,
      },
      {
        type: 'paragraph',
        text: `Then 2020 arrived and brought COVID-19 with it. The world stopped. Jobs disappeared. Remote work was not yet the widely available thing it is today. In the middle of all that uncertainty, she found a customer support role. It was her first remote job. It was not where she had imagined herself. But she took it. She worked it. She kept herself going. That quiet discipline of doing what needs to be done without waiting for perfect conditions is something that shows up again and again in who she is.`,
      },
      {
        type: 'paragraph',
        text: `In 2021, a friend called her with a simple request. Come help me set up a Google account so I can upload my app to the Play Store. She went. And when she got there, she discovered her friend was working with a client on Upwork. Something about that moment stirred a memory. She remembered the old TrueLancer account she had abandoned years ago when the walls would not let her through. She checked it. And this time, she was eligible for Payoneer. She opened the account that same day. It sounds like a small thing. But for someone who had been blocked at that exact door years earlier, it was enormous. The infrastructure she had always needed was finally available to her. She went back to freelancing properly, writing again, getting paid in a way that actually reached her, and building a reputation piece by piece.`,
      },
      {
        type: 'quote',
        text: `For someone who had been blocked at that exact door years earlier, it was enormous.`,
      },
      {
        type: 'paragraph',
        text: `In July 2022, she landed her first full time job as a Technical Writer at WriteTech Hub. For someone who had been writing on a phone with no audience, writing other people’s seminar papers just to eat, writing five blog posts a day for five thousand naira a month, that moment meant everything. It was proof that none of it had been wasted. Not the phone. Not the cyber cafe. Not the hard years. Not any of it. From WriteTech Hub, her career moved at a completely different speed. She worked across multiple organisations. She grew into copywriting, content strategy, Web3 education, and business consulting. She did not just grow as a writer. She became a strategist. A founder. A builder.`,
      },
      {
        type: 'paragraph',
        text: `Today, Lady Prowess runs Prowess Digital Solutions, a remote business consulting firm built for African entrepreneurs. She founded Dritchwear Collections, a custom streetwear brand with its own mobile app. She built Kivora Pay, a crypto bill payment platform on Solana for the African market. She leads teams. She produces strategy for brands. She thinks in systems, not in single tasks. She gets paid in Bitcoin and USDT. She is not just writing about Web3 and the future of African finance. She is living inside it, from the inside out.`,
      },
      {
        type: 'paragraph',
        text: `Everything she is today traces back to 2016. To a girl on a phone who just liked putting words together. Who had no clear path, no infrastructure designed for her, no guarantee that any of it would ever amount to anything. Who wrote for almost nothing. Who wrote to survive. Who wrote even when the platforms would not pay her and the market turned against her and the world shut down around her.`,
      },
      {
        type: 'quote',
        text: `She never stopped. And she is just getting started.`,
      },
    ],
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
