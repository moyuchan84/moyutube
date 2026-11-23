import fs from "node:fs";
const d = JSON.parse(fs.readFileSync("script/v1/shots.json", "utf8"));
const L = {
 L1:["November 2004. South Korea. The day of the national college entrance exam.","2004년 11월, 한국. 대학수학능력시험 날입니다."],
 L2:["Police said the answers were texted out of the exam rooms. And texted back in, by people outside.","경찰은 답이 시험장 밖으로 문자로 나갔고, 밖의 사람들이 다시 안으로 보냈다고 밝혔습니다."],
 L3:["Their starting point: one day of phone records. About three hundred million text messages. Find the cheaters.","수사의 출발점은 하루치 통신 기록, 약 3억 건의 문자였습니다. 이 속에서 부정행위자를 찾아야 했습니다."],
 L4:["But cheating is much older than text messages. And so are the locks built against it.","하지만 컨닝은 문자보다 훨씬 오래됐고, 그것을 막는 자물쇠도 그만큼 오래됐습니다."],
 L5:["Imperial China ran one of the most guarded exams ever built. Rows of tiny numbered cells. Every candidate searched. Everyone alone.","중국 과거제는 역사상 가장 철저하게 지킨 시험 중 하나였습니다. 번호 붙은 작은 칸, 몸수색, 혼자 앉는 응시자."],
 L6:["First trick: the examiner could see your name. The lock: erase it, and use a number.","첫 번째 속임수는 채점관이 이름을 볼 수 있다는 것이었습니다. 자물쇠는 이름을 지우고 번호를 쓰는 것이었습니다."],
 L7:["Second trick: he could recognize your handwriting. The lock: clerks copy every answer again, in red ink.","두 번째는 필체였습니다. 자물쇠는 서기가 모든 답안을 붉은 글씨로 다시 베끼는 것이었습니다."],
 L8:["It still failed. In 1858, a scandal at a provincial exam ended with the chief examiner executed. Historians still argue why.","그래도 뚫렸습니다. 1858년 향시 비리 사건에서는 수석 시험관이 처형됐고, 이유는 지금도 논쟁 중입니다."],
 L9:["Korea's Joseon dynasty ran the same exam. And candidates showed up with a team.","조선도 같은 시험을 치렀습니다. 그리고 응시자들은 팀을 데려왔습니다."],
 L10:["One person to compose the essay. Another to write it out, fast and neat.","글을 짓는 사람 하나, 빨리 깨끗하게 베껴 쓰는 사람 하나였습니다."],
 L11:["The state answered with the same tools. Names folded and sealed. Answers recopied in red.","나라는 같은 도구로 맞섰습니다. 이름은 접어 봉하고, 답안은 붉은 글씨로 다시 베꼈습니다."],
 L12:["Now, 2011. Long Island, New York. A college student was accused of taking the SAT for paying high schoolers. Seven arrests.","이제 2011년, 뉴욕 롱아일랜드입니다. 대학생이 돈을 받고 고등학생 대신 SAT를 본 혐의로 7명이 체포됐습니다."],
 L13:["How was it caught? School staff noticed that some students' grades and SAT scores did not match.","어떻게 잡혔을까요? 학교 직원이 일부 학생의 성적과 SAT 점수가 맞지 않는 것을 알아챘습니다."],
 L14:["Within months, twenty people were charged. And, according to reports, every registration now needed a photo, printed on the ticket.","몇 달 만에 20명이 기소됐습니다. 보도에 따르면 이후 등록 때 사진을 내고 수험표에 인쇄하게 바뀌었습니다."],
 L15:["Sometimes the cheaters are the adults. In Atlanta, a state investigation found cheating in forty-four of fifty-six schools, and named a hundred seventy-eight educators. In 2015, eleven were convicted.","때로는 어른들이 부정을 저지릅니다. 애틀랜타 주 조사는 56개 학교 중 44곳의 부정을 확인하고 교육자 178명을 지목했습니다. 2015년 11명이 유죄 판결을 받았습니다."],
 L16:["At Harvard in 2012, a take-home final for 279 students. The professor noticed answers that looked alike. About 125 cases, and roughly 70 students forced to withdraw.","2012년 하버드에서는 279명이 듣는 수업의 집에서 푸는 기말시험에서 비슷한 답안이 발견됐습니다. 약 125건이 조사됐고 약 70명이 휴학했습니다."],
 L17:["Now the newest trick is a chatbot in your pocket.","이제 가장 새로운 속임수는 주머니 속 챗봇입니다."],
 L18:["In 2025, about 13.4 million students sat China's gaokao. Radio signals were blocked at exam sites. And some AI apps switched off photo recognition during exam hours.","2025년 중국 가오카오에는 약 1,340만 명이 응시했습니다. 시험장에서는 전파가 차단됐고, 일부 AI 앱은 시험 시간에 사진 인식을 중단했습니다."],
 L19:["South Korea banned smart glasses, smartwatches, phones and earbuds from this year's exam. Wear AI glasses, and you lose next year's eligibility.","한국은 올해 수능에 스마트 안경, 스마트워치, 휴대폰, 이어폰 반입을 금지했습니다. 시험 중 AI 안경을 쓰면 다음 해 응시 자격을 잃습니다."],
 L20:["Back to 2004. How do you find answers hiding in three hundred million texts?","다시 2004년입니다. 3억 건의 문자 속에 숨은 답을 어떻게 찾을까요?"],
 L21:["Think about what a multiple-choice answer looks like. Only digits, one to five.","객관식 답이 어떻게 생겼는지 생각해 보세요. 1부터 5까지의 숫자뿐입니다."],
 L22:["That filter left about two hundred eighty thousand messages. Eighteen days later, a hundred eighty-two test-takers were indicted.","그렇게 거르자 약 28만 건이 남았습니다. 18일 뒤 응시자 182명이 기소됐습니다."],
 L23:["Every trick leaves a trail.","모든 속임수는 흔적을 남깁니다."],
 L24:["If AI can answer in a second, how would you build an exam that cannot be beaten? Tell me in the comments.","AI가 1초 만에 답한다면, 속일 수 없는 시험을 어떻게 만들겠어요? 댓글로 알려 주세요."],
};
d.lines = Object.fromEntries(Object.entries(L).map(([k,[en,ko]])=>[k,{en,ko}]));
fs.writeFileSync("script/shots.json", JSON.stringify(d, null, 2));
console.log(Object.keys(d.lines).length, "lines;", Object.values(L).reduce((a,[e])=>a+e.split(/\s+/).length,0), "words");
