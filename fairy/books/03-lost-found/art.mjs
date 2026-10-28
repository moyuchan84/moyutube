// 그림 목록 원본 → art.json (node books/03-lost-found/art.mjs) → npm run prompts -- 03-lost-found
// 화풍: fairy/art/refe3.jpg (어두운 우주 배경 · 거친 수채/그라슈 + 판화 질감 · 쨍한 색 · 흰 분필선 낙서) 참고
import fs from 'fs';

const style =
  'Drawing style (copy the look from the attached style reference image): a handmade, textured picture-book look like gouache and oil-pastel monoprint with a risograph / screen-print grain. Visible paper grain and speckled noise, slightly rough uneven edges, flat saturated blocks of color (coral red, teal, lime green, sunny yellow, cobalt blue, hot pink) with scratchy white chalk-line details, little dots, dashes and doodle patterns on every object. Quirky, simple, funny-cute character shapes with big round dotted eyes and wide happy mouths. Deep dark navy / ink-black or deep teal backgrounds that make colors glow, tiny glittering stars and sparkles in the air, hand-cut paper feeling. Playful, bold, imaginative and warm. Not 3D, not glossy, not photorealistic, no thin digital vector lines, no anime.';

const ref =
  'The attached style reference is ONLY for the drawing technique (texture, grain, color blocking, chalk-line details, dark glowing backgrounds). Do NOT copy its characters, aliens, planet, composition, hand-lettered words or props. Draw the new scene described below, and keep every character\'s face, colors and shape identical on every page (match the attached cast sheet if provided).';

const tail =
  'Landscape 16:9, full frame with NO black bars or borders. Keep the bottom 15% calm and uncluttered (subtitles go there) and keep faces away from the very edges. "Memory light" is drawn as a warm golden-yellow / peach glow with tiny sparkles around an object: bright and big when the object feels loved, dim and grey-ish when it is fading.';

const neg =
  'No text, no letters, no numbers, no Korean or English words or signs, no captions, no logos, no watermark, no brand names, no photo-realism, no existing cartoon characters, no horror, no scary or violent faces, no extra fingers, no 3D render, no anime, no thin clean vector outlines, no black letterbox bars.';

const characters = {
  grandpa:
    'GRANDPA DRAWER: the old wooden drawer cabinet itself is a kind old grandpa. Boxy warm-brown cabinet body with wood-grain scratches in white chalk, rows of drawers forming his chest, one big top drawer as a face with round little glasses, bushy white eyebrows and a white mustache made of paper-cut shapes. A bit hunched and heavy when full; light and straight-backed at the end.',
  notebook:
    'NOTEBOOK: a bold, brave monster-doodle notebook, cobalt-blue cover covered with wild scribbled little monsters in lime, pink and yellow, a spiral binding like a toothy grin, round white eyes. Strong, big-brother attitude.',
  rope:
    'YELLOW JUMP ROPE: a sunny-yellow jump rope with red handles that act as little ears, a timid worried face, it curls up when scared and stretches its long neck when excited.',
  umbrella:
    'BLUE UMBRELLA: a tall slender deep-blue umbrella with a curved handle, soft sleepy eyes, a patient gentle face, dusty and dull when sad, glowing bright when remembering.',
  jacket:
    'JACKET: a small rust-orange zip jacket with dangling worried sleeves, a zipper smile, anxious eyebrows, scribbled white stitch lines.',
  pencilcase:
    'PENCIL CASE (nicknamed Tongtong): the main character. A small rounded rectangular pencil case with a cute round-eared cat pattern (a new original chubby cat character), covered with scribbled doodles in marker and scratches, a bit of ribbon on it in later scenes. Shy, shrinking, scared eyes at first; a shy smile at the end.',
  doyun:
    'DOYUN: an elementary school boy of about 9, short messy black hair, usually wearing a loose mustard-yellow baseball cap, a teal hoodie, round rosy cheeks that turn bright red when embarrassed. Mischievous at first, later guilty, then sincere and gentle. Simple chalk-textured face, dotted eyes.',
  jihun:
    'JIHUN: an elementary school boy of about 9 with spiky brown hair and a lime-green sweatshirt, big round glasses, creative and cheerful; teary when he loses his notebook.',
  eunseo:
    'EUNSEO: an elementary school girl of about 9 with two high pigtails tied with red ribbons, a pink T-shirt and white sneakers, energetic and sporty.',
  minjun:
    'MINJUN: an elementary school boy of about 9 with a round buzz cut and a bright-yellow raincoat-style jacket, loves rainy days, always jumpy and playful.',
  girl:
    'GIRL: an elementary school girl of about 9 with a short black bob and a light-purple cardigan, a cheerful, kind and sharp-eyed girl who recognizes the cat pencil case.',
  hat:
    'HAT: a round red baseball cap with a wink and a big grin. SHOES: a pair of green-and-white football cleats with a confident shooting-pose. They appear together as cheerful secondary objects.',
  scarf:
    'SCARF and WATER BOTTLE: a long striped teal-and-pink scarf with a happy face, and a small orange water bottle with a waving arm, always together; they wave happily to the viewer.',
  kids:
    'SCHOOL KIDS: a crowd of simple, friendly elementary school children in colorful clothes (coral, teal, yellow, lavender), with dotted eyes and wide mouths, all in the same textured paper-cut look; some are busy, some amazed.',
  place:
    'SCHOOL HALLWAY SETTING: a long first-floor school hallway with a polished teal-green floor, cream walls with textured speckles, tall windows, a bulletin board and a wall calendar with a big red circle. In the dark night scenes the hallway is deep navy with moonlit window squares.',
  cart:
    'CART: a rickety wooden hand cart with two round wheels and a long handle, a tilted, slightly spooky-looking but not scary silhouette in the night; in the morning it carries objects to the display hall.',
  show:
    'DISPLAY HALL: the school gym turned into a bazaar and fashion show: a long catwalk stage with string lights and colorful pennant flags, display tables covered with cloth and handwritten name cards, a loudspeaker on the ceiling.',
};

// [id, scene, chars, bg, desc, comp]
const rows = [
  ['p01', 1, ['grandpa', 'place'], 'dusky teal and warm dusty rose, speckled grain', 'The long first-floor school hallway at the very end: an old, big, dusty wooden drawer cabinet stands alone in the corner, forgotten, with a thick layer of dust and a soft beam of window light falling on it.', 'Wide shot, the cabinet small in the right third, long empty hallway receding to the left.'],
  ['p02', 2, ['grandpa', 'notebook', 'rope', 'umbrella', 'jacket'], 'warm brown and honey yellow with deep navy shadows', 'Grandpa Drawer stretches his hunched back with his drawers opening one by one; different objects (notebook, jump rope, umbrella, jacket) poke their faces out of the drawers. The drawers are crammed full and he looks heavy and tired but kind.', 'Medium shot, the cabinet fills the frame, grandpa face at top center.'],
  ['p03', 3, ['notebook', 'rope', 'umbrella', 'jacket', 'pencilcase'], 'deep navy ink-black with warm glows', 'Inside the drawers, each lost object has a different brightness of golden memory-light: the notebook glows brightly, the jump rope glows well, the umbrella glows only faintly and the pencil case is nearly dim. Show the difference clearly.', 'Wide shot, objects lined along a shelf like a row of lamps from bright to dim.'],
  ['p04', 4, ['notebook', 'rope', 'umbrella', 'jacket', 'pencilcase'], 'deep midnight navy with a few stars through a window', 'Night in the hallway: the lost objects huddle in a circle whispering, each one holding up a tiny mirror-like glow to check how much light is left. They look worried and whisper behind their hands. A crescent moon in the window.', 'Medium shot, circle of objects with faces turned toward each other.'],
  ['p05', 5, ['notebook', 'rope', 'place'], 'deep navy with one big glowing red circle', 'A dark night wall: a calendar on the wall has a huge glowing red circle on one date. Below, the notebook trembles and the yellow jump rope curls up tightly in fear, both staring up at the calendar.', 'Medium shot, calendar in the upper right, objects in the lower left looking up.'],
  ['p06', 6, ['umbrella', 'scarf', 'cart'], 'deep indigo fading into foggy blue-grey, distant warm musical notes', 'The blue umbrella whispers a story; above his head a faint dreamlike flashback bubble shows a cart in winter carrying a scarf and a water bottle away, with soft musical notes floating from far away and little hands covering ears.', 'Medium shot of the umbrella in front, flashback bubble in the upper right.'],
  ['p07', 7, ['notebook', 'jihun'], 'warm yellow glow against deep navy', 'The monster-doodle notebook shines brightly and boldly. In a small speech-bubble window beside it, Jihun sits at a desk, tearfully missing his notebook with wet eyes.', 'Medium shot, big glowing notebook on the left, small round bubble with Jihun on the right.'],
  ['p08', 8, ['rope', 'eunseo'], 'sunny yellow and teal with soft navy edges', 'Two panels: (left) a flashback of Eunseo happily jumping rope, the rope glowing proudly with a ten-count of sparkles; (right) the yellow jump rope in the drawer stretching its long neck to look at a passing pair of white indoor shoes, then drooping disappointed.', 'Split composition, left memory panel and right real panel.'],
  ['p09', 9, ['umbrella'], 'dusty grey-blue with dimming gold', 'The blue umbrella stands in the drawer, covered with dust, its glow weak and flickering, gazing toward the hallway door, waiting for months. Tiny dust motes in the air and a clock ticking on the wall.', 'Medium shot, umbrella in the left, door in the right far away.'],
  ['p10', 10, ['jacket', 'kids'], 'warm orange against deep navy', 'The small jacket droops its sleeves in worry and imagines, in a thought bubble, its owner having grown tall into a big kid; a measuring ruler beside it.', 'Medium shot, jacket large on the left, thought bubble on the right.'],
  ['p11', 11, ['kids', 'place', 'notebook', 'rope'], 'bright teal and cream, noisy daytime', 'Daytime hallway, noisy and busy: many kids rush by without looking at the notice on the wall or the old drawer cabinet. Through the cracks of the drawers little eyes peek out anxiously.', 'Wide shot, children in motion blur-like scribble lines, the cabinet small in the right corner with peeking eyes.'],
  ['p12', 12, ['pencilcase', 'doyun'], 'coral red and deep navy', 'Two moments: Doyun scribbles messily all over a pencil case with a marker and later flings it across the floor; the pencil case grimaces in pain with tiny stars of hurt.', 'Medium shot, Doyun at the left throwing, the pencil case flying and sprawled at the right floor.'],
  ['p13', 13, ['pencilcase', 'grandpa'], 'almost black with a tiny dim glow', 'The scribbled pencil case curls up alone in the darkest corner of the drawer, very dim, hugging its own corners, afraid and lonely, a faint ghost shape of Doyun on the wall.', 'Close-up, the case centered low, big dark negative space above.'],
  ['p14', 14, ['umbrella', 'notebook', 'rope', 'jacket'], 'deep navy with a sudden flicker of cold light', 'The blue umbrella flickers and its light is almost out; the other objects rush toward it in alarm with shocked faces.', 'Medium shot, umbrella at center, others running in from both sides.'],
  ['p15', 15, ['umbrella', 'notebook', 'minjun'], 'warm yellow and rainy blue', 'The notebook comforts the umbrella; a flashback bubble shows Minjun in the rain jumping with the opened umbrella as if it were a parachute, and the umbrella slowly glowing bright gold again.', 'Medium shot, two objects at the bottom, large round flashback bubble above.'],
  ['p16', 16, ['pencilcase', 'notebook'], 'deep indigo with a soft gold lining', 'The notebook sits next to the hurt, dim pencil case in the corner and gently talks to it. The pencil case looks down but a very small glow remains at its center.', 'Medium two-shot, pencil case lower right, notebook leaning in from the left.'],
  ['p17', 17, ['cart', 'notebook', 'rope', 'umbrella', 'jacket', 'pencilcase'], 'dawn grey-blue to pale peach, a bit tense', 'Morning: a wooden cart rolls toward the school entrance; the objects, piled on it, shut their eyes tightly in fear. The red-circle day. Not scary, just tense and dramatic.', 'Wide shot, the cart at center on a diagonal, the door frame to the left.'],
  ['p18', 18, ['kids', 'pencilcase', 'show'], 'soft warm teal and pale peach', 'Close-up: kids\' hands wipe the dust off the pencil case with a damp cloth, and a pencil writes on a card beside it. The objects still keep their eyes shut.', 'Close-up, two hands with a cloth in the center, objects soft in the background.'],
  ['p19', 19, ['show', 'notebook', 'rope', 'umbrella', 'jacket', 'pencilcase'], 'bright teal and warm yellow with festive string lights', 'The objects open their eyes in surprise: they are neatly placed on a clean display hall with tablecloths. A loudspeaker on the ceiling plays an announcement with colorful music notes coming out.', 'Wide shot, the objects at the bottom row looking up at the loudspeaker at top.'],
  ['p20', 20, ['show', 'jacket', 'hat', 'kids'], 'hot pink, yellow and deep blue stage lights, festive', 'A fashion show runway: kids walk the stage wearing the jacket (flapping proudly), the red hat winks, and a kid wearing the football cleats strikes a shooting pose, with colorful spotlights and confetti sparkles.', 'Wide shot, runway lined with string lights and the kids posing.'],
  ['p21', 21, ['kids'], 'bright coral and sunny yellow', 'The audience below the stage: kids cheering and clapping with wide-open amazed mouths and sparkling eyes, one pointing at the stage saying wow.', 'Medium shot of excited kids in the foreground, the stage edge in the background.'],
  ['p22', 22, ['show', 'notebook', 'rope'], 'warm cream and soft teal', 'Display tables with handwritten name cards beside each object (draw cards as simple scribbled lines, no readable text): the monster notebook and the yellow jump rope each next to a neat card, friends looking at them from beside.', 'Close-up of tables, cards in the foreground, objects behind.'],
  ['p23', 23, ['show', 'pencilcase', 'kids'], 'dusky teal and muted violet, a little sad', 'A pencil case on a display table, cleaned and tied with a pretty ribbon, but the scribbles still show. A few kids stop and whisper to each other while giving it a pitying look. In the background, a bright stage with other objects; the pencil case looks sad.', 'Medium shot, the pencil case lower right, whispering kids on the left, bright stage far away.'],
  ['p24', 24, ['doyun', 'pencilcase', 'show'], 'warm teal with a red blush on his ears', 'In a corner of the hall Doyun secretly listens, with his cap pulled low and his ears bright red from embarrassment and a hand clutching his chest. The pencil case is seen far away on a table.', 'Medium shot, Doyun in the left foreground, the case small in the right background.'],
  ['p25', 25, ['girl', 'doyun', 'pencilcase'], 'explosive golden yellow glow against deep navy', 'The climax: a girl gently lifts the cat pencil case, delighted; at the right under a cap, Doyun imagines the happy day he first bought it in a round dream bubble; the pencil case bursts out a dazzling golden light, brighter than any jewel, with sparkles filling the frame.', 'Medium shot, the glowing case at the center, Doyun and his dream bubble at the right.'],
  ['p26', 26, ['doyun', 'pencilcase'], 'warm teal and pale yellow', 'Doyun takes off his cap and steps forward and says "wait, that is mine"; the pencil case shrinks back anxiously, afraid it will be thrown again. Doyun gently reaches out with both hands.', 'Medium two-shot, Doyun left, the pencil case right with an anxious face.'],
  ['p27', 27, ['doyun', 'pencilcase', 'girl'], 'warm golden glow with peach hearts and sparkles', 'Emotional peak: Doyun hugs the pencil case tight to his chest with teary eyes and a sincere smile, the case shyly smiling and glowing soft gold. The girl beside him grins warmly.', 'Close-up, Doyun and the case centered, the girl smiling on the right.'],
  ['p28', 28, ['notebook', 'rope', 'umbrella', 'jacket', 'jihun', 'eunseo', 'minjun'], 'bright cheerful teal, coral and yellow, everything glowing', 'Montage of reunions in four mini-panels: Jihun proudly showing the notebook to his friends; Eunseo jumping with the rope; Minjun opening the blue umbrella and jumping like a parachute; a kid trying on the jacket, which fits perfectly. All objects glow golden.', 'Four-panel collage layout with bright glowing objects in each.'],
  ['p29', 29, ['hat', 'scarf', 'kids'], 'bright winter blue and sunshine yellow', 'New owners: the red cap and the football cleats sparkle in the arms of new friends; far in the hallway the scarf and water bottle from last winter wave happily with their new owners.', 'Wide shot, the near pair at the left, the far pair waving in the long hallway at right.'],
  ['p30', 30, ['grandpa', 'kids', 'doyun', 'place'], 'warm sunny teal and honey', 'The kids run to the drawer cabinet when they lose something; they hug the cap and key ring they found, and Doyun carefully puts the pencil case into his school bag. The cabinet is cheerful with its drawers neat.', 'Medium shot, cabinet at left with kids, Doyun and the bag in the right foreground.'],
  ['p31', 31, ['grandpa', 'notebook', 'rope', 'umbrella', 'jacket', 'pencilcase'], 'deep warm navy glowing with golden lights, hopeful ending', 'Final scene: Grandpa Drawer smiling with a straight back, his drawers lightly open, and every object inside shining with its own different warm light, waiting for their owners. Tiny stars in the air.', 'Wide, symmetrical shot of the cabinet at center, calm and warm.'],
];

const scenes = [
  { id: 'cast', scene: 'cast', chars: ['grandpa', 'notebook', 'rope', 'umbrella', 'jacket', 'pencilcase', 'doyun', 'hat', 'scarf'], bg: 'deep ink-black navy with tiny sparkles', desc: 'CHARACTER SHEET (not a story scene): all the main characters standing in one neat line on a plain deep-navy background, full body, facing the viewer, evenly spaced so each is clearly visible: Grandpa Drawer (largest, left), notebook, yellow jump rope, blue umbrella, jacket, the cat pencil case (center, the main character), the red cap and football cleats, the scarf and water bottle, and Doyun at the right end wearing his yellow cap.', comp: 'Wide lineup, plain background, no props except what is listed. Use this image as the cast reference for every later page.' },
  { id: 'cover', scene: 'cover', chars: ['grandpa', 'notebook', 'rope', 'umbrella', 'jacket', 'pencilcase', 'place'], bg: 'deep navy ink-black with glowing golden lights', desc: 'Book cover. In the dark corner of a school hallway the old Grandpa Drawer opens his drawers wide; the pencil case in the middle shines with the brightest golden light, surrounded by the notebook, jump rope, umbrella and jacket, each with different glowing light, like a night sky of lanterns. Sparkles and stars float all around.', comp: 'Wide, symmetrical, the glowing pencil case at the center; leave the upper-center area calm and empty for the book title (do not draw any text).' },
  ...rows.map(([id, scene, chars, bg, desc, comp]) => ({ id, scene, chars, bg, desc, comp })),
];

const art = {
  note: '장면별 그림 목록. id 가 곧 저장할 파일 이름(art/<id>.png). 내용은 영어로 적는다. 화풍은 fairy/art/refe3.jpg (어두운 우주 배경 + 거친 판화 질감 + 쨍한 색) 참고. 먼저 cast(등장인물 시트)를 뽑아 얼굴을 고정하고, 이후 장면마다 refe3.jpg + cast.png 를 같이 첨부한다. 첨부를 거절하면 node scripts/textprompt.mjs 03-lost-found <id> 로 글로만 된 프롬프트를 쓴다.',
  attach: ['art/refe3.jpg', 'books/03-lost-found/art/cast.png (cast 를 뽑은 뒤부터)'],
  style, ref, tail, neg, characters,
  scenes,
};
fs.writeFileSync(new URL('./art.json', import.meta.url), JSON.stringify(art, null, 1) + '\n');
console.log(scenes.length + '개 그림 → art.json');
