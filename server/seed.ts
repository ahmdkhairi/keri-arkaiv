import { Album } from './models/Album';

export async function seedDatabase() {
  try {
    const count = await Album.countDocuments();
    
    if (count > 0) {
      console.log('📚 Database already seeded with', count, 'albums');
      return;
    }

    const albums = [
      {
        title: "Nevermind",
        artist: "Nirvana",
        year: 1991,
        genre: "Grunge",
        label: "DGC Records",
        about: "Nevermind is the second studio album by American rock band Nirvana, released on September 24, 1991. Produced by Butch Vig, it was Nirvana's first release on DGC Records. The album brought grunge and alternative rock to mainstream consciousness and propelled Nirvana to worldwide fame. Nevermind was a massive commercial success, reaching number one on the US Billboard 200 and launching the iconic single 'Smells Like Teen Spirit', which became an anthem for Generation X.",
        cover: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
        tracks: [
          { title: "Smells Like Teen Spirit", duration: "5:01", file: "nevermind-01.mp3" },
          { title: "In Bloom", duration: "4:14", file: "nevermind-02.mp3" },
          { title: "Come as You Are", duration: "3:38", file: "nevermind-03.mp3" },
          { title: "Breed", duration: "3:03", file: "nevermind-04.mp3" },
          { title: "Lithium", duration: "4:17", file: "nevermind-05.mp3" },
          { title: "Polly", duration: "2:57", file: "nevermind-06.mp3" },
          { title: "Territorial Pissings", duration: "2:22", file: "nevermind-07.mp3" },
          { title: "Drain You", duration: "3:43", file: "nevermind-08.mp3" },
          { title: "Lounge Act", duration: "2:36", file: "nevermind-09.mp3" },
          { title: "Stay Away", duration: "3:32", file: "nevermind-10.mp3" },
          { title: "On a Plain", duration: "3:16", file: "nevermind-11.mp3" },
          { title: "Something in the Way", duration: "3:51", file: "nevermind-12.mp3" },
        ]
      },
      {
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        year: 1973,
        genre: "Progressive Rock",
        label: "Harvest Records",
        about: "The Dark Side of the Moon is the eighth studio album by English rock band Pink Floyd, released on 1 March 1973. It is one of the most critically acclaimed and commercially successful rock albums of all time. The album explores themes such as conflict, greed, time, death, and mental illness, the latter inspired by former bandmate Syd Barrett's deteriorating mental state. The Dark Side of the Moon is celebrated for its sonic experimentation, philosophical lyrics, and pioneering use of studio effects. It spent a record-breaking 741 weeks on the Billboard 200 chart.",
        cover: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        tracks: [
          { title: "Speak to Me", duration: "1:30", file: "darkside-01.mp3" },
          { title: "Breathe (In the Air)", duration: "2:43", file: "darkside-02.mp3" },
          { title: "On the Run", duration: "3:36", file: "darkside-03.mp3" },
          { title: "Time", duration: "6:53", file: "darkside-04.mp3" },
          { title: "The Great Gig in the Sky", duration: "4:36", file: "darkside-05.mp3" },
          { title: "Money", duration: "6:23", file: "darkside-06.mp3" },
          { title: "Us and Them", duration: "7:49", file: "darkside-07.mp3" },
          { title: "Any Colour You Like", duration: "3:26", file: "darkside-08.mp3" },
          { title: "Brain Damage", duration: "3:49", file: "darkside-09.mp3" },
          { title: "Eclipse", duration: "2:03", file: "darkside-10.mp3" },
        ]
      },
      {
        title: "Abbey Road",
        artist: "The Beatles",
        year: 1969,
        genre: "Rock",
        label: "Apple Records",
        about: "Abbey Road is the eleventh studio album by English rock band the Beatles, released on 26 September 1969. It is the last album the Beatles recorded, although Let It Be was the last album completed before the band's break-up in April 1970. Abbey Road is widely regarded as one of the Beatles' best and most popular albums. The album features the iconic medley on side two, which blends together multiple songs seamlessly. The album cover, featuring the four band members walking across a zebra crossing outside Abbey Road Studios, has become one of the most famous and imitated images in the history of recorded music.",
        cover: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
        tracks: [
          { title: "Come Together", duration: "4:20", file: "abbey-01.mp3" },
          { title: "Something", duration: "3:03", file: "abbey-02.mp3" },
          { title: "Maxwell's Silver Hammer", duration: "3:27", file: "abbey-03.mp3" },
          { title: "Oh! Darling", duration: "3:26", file: "abbey-04.mp3" },
          { title: "Octopus's Garden", duration: "2:51", file: "abbey-05.mp3" },
          { title: "I Want You (She's So Heavy)", duration: "7:47", file: "abbey-06.mp3" },
          { title: "Here Comes the Sun", duration: "3:05", file: "abbey-07.mp3" },
          { title: "Because", duration: "2:45", file: "abbey-08.mp3" },
          { title: "You Never Give Me Your Money", duration: "4:02", file: "abbey-09.mp3" },
          { title: "Sun King", duration: "2:26", file: "abbey-10.mp3" },
          { title: "Mean Mr. Mustard", duration: "1:06", file: "abbey-11.mp3" },
          { title: "Polythene Pam", duration: "1:12", file: "abbey-12.mp3" },
          { title: "She Came In Through the Bathroom Window", duration: "1:57", file: "abbey-13.mp3" },
          { title: "Golden Slumbers", duration: "1:31", file: "abbey-14.mp3" },
          { title: "Carry That Weight", duration: "1:36", file: "abbey-15.mp3" },
          { title: "The End", duration: "2:19", file: "abbey-16.mp3" },
          { title: "Her Majesty", duration: "0:23", file: "abbey-17.mp3" },
        ]
      }
    ];

    await Album.insertMany(albums);
    console.log('✅ Database seeded with', albums.length, 'classic albums');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
