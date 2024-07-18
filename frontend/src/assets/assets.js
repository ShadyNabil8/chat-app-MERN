import image1 from './naruto.jpeg'
import image2 from './Kakashi.webp'



import emojiLaugh from './emoji-laugh.png'
import emojiLaughDark from './emoji-laugh-dark.png'
import emojiLove from './emoji-love.png'
import emojiLoveDark from './emoji-love-dark.png'
import emojiSuperstar from './emoji-superstar.png'
import emojiSad from './emoji-sad.png'
import emojicool from './emoji-cool.png'
import emojiConfusion from './emoji-confusion.png'
import emojiWink from './emoji-wink.png'
import emojiShocked from './emoji-shocked.png'
import emojiSmiling from './emoji-smiling.png'
import emojiAngry from './emoji-angry.png'
import emojiWow from './emoji-wow.png'

export const colorEmojiList = [
    emojiSuperstar,
    emojiLove,
    emojiSad,
    emojicool,
    emojiConfusion,
    emojiWink,
    emojiShocked,
    emojiSmiling,
    emojiAngry,
    emojiWow,
    emojiLaugh,
]

export const testMessages = [
    {
        sender: 'shady',
        date: 'Today 15.30 AM',
        text: 'السلام عليكم و رحمة الله و بركاته',
        image: image1,
        myMessage: true
    }, {
        sender: 'shady',
        date: 'Today 15.30 AM',
        text: 'السلام عليكم و رحمة الله و بركاته',
        image: image2,
        myMessage: false
    },
    {
        sender: 'shady',
        date: 'Today 15.30 AM',
        text: 'Hello world!, My name is Shady. What is yours 😅?',
        image: image1,
        myMessage: true
    },
    {
        sender: 'shady',
        date: 'Today 15.30 AM',
        text: 'Hello world!, My name is Shady. What is yours?',
        image: image2,
        myMessage: false
    }, {
        sender: 'shady',
        date: 'Today 15.30 AM',
        text: 'Hello world!, My name is Shady. What is yours?',
        image: image1,
        myMessage: true
    }, {
        sender: 'shady',
        date: 'Today 15.30 AM',
        text: 'Hello world!, My name is Shady. What is yours?',
        image: image2,
        myMessage: false
    }

];

export const darkEmojiList = [emojiLaughDark, emojiLoveDark]