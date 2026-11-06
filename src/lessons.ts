export type CourseId = 'ai-eng' | 'prompt-eng';

export interface QuizQuestion {
  question: string;
  type?: 'choice' | 'text';          // default: 'choice'
  lesson?: string;                    // qaysi darsga tegishli (badge uchun)
  options?: { text: string; correct: boolean }[];  // 'choice' uchun
  keywords?: string[];               // 'text' uchun: javobda bo'lishi kerak
  modelAnswer?: string;              // 'text' uchun: to'g'ri javob namunasi
}

export interface LessonStep {
  type: 'info' | 'quiz' | 'code' | 'playground' | 'video' | 'finalquiz';
  title: string;
  content: string;
  code?: string;
  successCheck?: string; // string that must appear in output
  quiz?: QuizQuestion;
  // 'finalquiz' qadami uchun: mavzu bo'yicha bir nechta savol (dars oxirida)
  questions?: QuizQuestion[];
  // 'playground' qadami uchun: jonli Claude API bilan prompt amaliyoti
  playground?: { task: string; starterPrompt?: string; systemHint?: string };
  // 'video' qadami uchun: YouTube havolasi (url bo'sh bo'lsa — "tez orada" placeholder)
  video?: { url?: string; note?: string };
}

export interface Lesson {
  id: string;
  course: CourseId;
  phase: number;
  topic: number;
  title: string;
  xp: number;
  steps: LessonStep[];
}

// AI Engineering kursi darslari (course maydoni quyida avtomatik qo'shiladi)
const aiEngLessons: Omit<Lesson, 'course'>[] = [
  // ─── PHASE 00: ASOSLAR ───────────────────────────────────────────
  {
    id: '00-0', phase: 0, topic: 0, title: "Python: print() va O'zgaruvchilar", xp: 100,
    steps: [
      {
        type: 'info', title: "Python nima va nima uchun AI?",
        content: `Python — dunyodagi eng mashhur dasturlash tili va AI/ML sohasining rasmiy tili hisoblanadi.\n\n**Nima uchun Python?**\n- 📦 Minglab tayyor kutubxonalar (NumPy, PyTorch, Transformers)\n- 🔤 O'qilishi oson, ingliz tiliga yaqin sintaksis\n- ⚡ GPU bilan birga ishlash imkoniyati\n\nHar bir AI muhandis Python bilan ishlaydi.`
      },
      {
        type: 'code', title: "print() — birinchi kod",
        content: `**print()** funksiyasi ekranga matn chiqaradi. Bu AI dasturlashning eng birinchi qadami.\n\n**Misol:**\n\`\`\`python\nprint("Salom, AI!")  # ekranga chiqaradi\n\`\`\`\n\n**Topshiriq:** Quyidagi kodni ishga tushiring va "Salom, O'zbek AI!" ni ekranda ko'ring.`,
        code: `# Birinchi Python kodingiz
print("Salom, O'zbek AI!")
print("AI Engineering kursiga xush kelibsiz!")`,
        successCheck: "Salom"
      },
      {
        type: 'quiz', title: "Tushundingizmi?",
        content: "Python da ekranga matn chiqarish uchun qaysi funksiya ishlatiladi?",
        quiz: {
          question: "Python da ekranga matn chiqarish uchun qaysi funksiya ishlatiladi?",
          options: [
            { text: "print()", correct: true },
            { text: "echo()", correct: false },
            { text: "console.log()", correct: false },
            { text: "show()", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '00-1', phase: 0, topic: 0, title: "Python: O'zgaruvchilar va Ma'lumot Turlari", xp: 100,
    steps: [
      {
        type: 'info', title: "O'zgaruvchilar (Variables)",
        content: `O'zgaruvchi — ma'lumotni xotiraga saqlaydigan "quti". AI da o'zgaruvchilarsiz hech narsa qilolmaysiz.\n\n**4 asosiy tur:**\n- \`int\` — butun son: \`age = 25\`\n- \`float\` — kasrli son: \`score = 0.95\`\n- \`str\` — matn: \`name = "GPT"\`\n- \`bool\` — mantiq: \`is_trained = True\``
      },
      {
        type: 'code', title: "O'zgaruvchilar bilan ishlash",
        content: `**Topshiriq:** AI model haqida o'zgaruvchilar yarating va print() bilan chiqaring.\n\nQuyidagi kodni ishga tushiring:`,
        code: `# AI model ma'lumotlari
model_name = "GPT-4"
parameters = 1_000_000_000_000  # 1 trillion
accuracy = 0.924
is_deployed = True

print("Model:", model_name)
print("Parametrlar:", parameters)
print("Aniqlik:", accuracy)
print("Deploy qilinganmi:", is_deployed)`,
        successCheck: "Model:"
      },
      {
        type: 'quiz', title: "O'zgaruvchi turlari",
        content: "Qaysi o'zgaruvchi turi AI modelning aniqlik foizini (0.95) saqlash uchun to'g'ri?",
        quiz: {
          question: "0.95 ni saqlash uchun qaysi tur to'g'ri?",
          options: [
            { text: "float", correct: true },
            { text: "int", correct: false },
            { text: "str", correct: false },
            { text: "bool", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '00-2', phase: 0, topic: 0, title: "Python: Ro'yxatlar va Lug'atlar", xp: 150,
    steps: [
      {
        type: 'info', title: "List va Dictionary — AI ning asosi",
        content: `AI da ma'lumotlar to'plami sifatida ishlatiladi:\n\n**List (Ro'yxat):**\n\`\`\`python\ntokens = ["Salom", "men", "AI", "man"]\n\`\`\`\n\n**Dictionary (Lug'at):**\n\`\`\`python\nmodel = {"name": "GPT", "layers": 96, "heads": 96}\n\`\`\`\n\nTokenizer va Embedding lar aynan shu tuzilmalardan foydalanadi.`
      },
      {
        type: 'code', title: "Tokenizer simulyatsiyasi",
        content: `**Topshiriq:** Oddiy tokenizer yasang — gapni bo'sh joylari bo'yicha tokenlarga ajrating.`,
        code: `# Oddiy tokenizer simulyatsiyasi
sentence = "Salom men AI muhandisiman"
tokens = sentence.split()

print("Asl gap:", sentence)
print("Tokenlar:", tokens)
print("Token soni:", len(tokens))

# Har bir tokenga ID berish
vocab = {token: i for i, token in enumerate(tokens)}
print("Lug'at:", vocab)`,
        successCheck: "Tokenlar:"
      },
      {
        type: 'quiz', title: "List vs Dictionary",
        content: "AI da tokenlarni tartibli saqlash uchun qaysi tuzilma to'g'ri?",
        quiz: {
          question: "Tokenlarni tartibli saqlash uchun?",
          options: [
            { text: "List []", correct: true },
            { text: "Dictionary {}", correct: false },
            { text: "String", correct: false },
            { text: "Integer", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '00-3', phase: 0, topic: 0, title: "Python: Funksiyalar", xp: 150,
    steps: [
      {
        type: 'info', title: "Funksiyalar — kodni qayta ishlatish",
        content: `Funksiya — bir ish uchun yozilgan kod bloki. AI kutubxonalari minglab funksiyalardan tashkil topgan.\n\n\`\`\`python\ndef greet(name):\n    return f"Salom, {name}!"\n\nresult = greet("AI")\nprint(result)  # Salom, AI!\n\`\`\`\n\n**Nima uchun muhim?** PyTorch, HuggingFace — hammasi funksiyalar va classlar ustiga qurilgan.`
      },
      {
        type: 'code', title: "Aktivatsiya funksiyasi",
        content: `**Topshiriq:** Neyron tarmoqlardagi ReLU aktivatsiya funksiyasini yozing.\n\nReLU: agar x > 0 bo'lsa x, aks holda 0.`,
        code: `# ReLU - eng mashhur aktivatsiya funksiyasi
def relu(x):
    return max(0, x)

# Sinab ko'ring
values = [-3, -1, 0, 1, 5, 10]
print("ReLU natijalari:")
for v in values:
    print(f"  relu({v}) = {relu(v)}")`,
        successCheck: "ReLU natijalari:"
      },
      {
        type: 'quiz', title: "ReLU haqida",
        content: "ReLU(-5) qancha bo'ladi?",
        quiz: {
          question: "ReLU(-5) = ?",
          options: [
            { text: "0", correct: true },
            { text: "-5", correct: false },
            { text: "5", correct: false },
            { text: "Error", correct: false }
          ]
        }
      }
    ]
  },

  // ─── PHASE 00: MATEMATIKA ─────────────────────────────────────────
  {
    id: '00-4', phase: 0, topic: 1, title: "Matematika: Vektorlar va NumPy", xp: 150,
    steps: [
      {
        type: 'info', title: "Vektorlar — Embedding ning asosi",
        content: `AI da har bir so'z **vektor** (raqamlar ro'yxati) sifatida ifodalanadi:\n\n\`\`\`\n"Mushuk" → [0.2, -0.8, 0.5, 0.1, ...]\n"It"     → [0.3, -0.7, 0.4, 0.2, ...]\n\`\`\`\n\n**NumPy** — Python da vektorlar va matritsalar bilan ishlashning asosiy kutubxonasi. PyTorch ham NumPy ustiga qurilgan.`
      },
      {
        type: 'code', title: "NumPy bilan vektorlar",
        content: `**Topshiriq:** Ikkita embedding vektorining **dot product** ini hisoblang — bu attention mexanizmining asosi!`,
        code: `import numpy as np

# Ikki so'zning embedding vektori (soddalashtirilgan)
word1 = np.array([0.2, 0.8, -0.3, 0.5])  # "Mushuk"
word2 = np.array([0.1, 0.7, -0.2, 0.4])  # "It"

# Dot product - o'xshashlikni o'lchaydi
similarity = np.dot(word1, word2)

print("word1:", word1)
print("word2:", word2)
print("O'xshashlik (dot product):", round(float(similarity), 4))
print("Vektorlar yaqinmi?", "Ha" if similarity > 0.5 else "Yo'q")`,
        successCheck: "O'xshashlik"
      },
      {
        type: 'quiz', title: "Dot product nima?",
        content: "Attention mexanizmida dot product nima uchun ishlatiladi?",
        quiz: {
          question: "Attention da dot product nima beradi?",
          options: [
            { text: "Tokenlar orasidagi o'xshashlik darajasini", correct: true },
            { text: "Tokenlarni bo'sh joyga ajratadi", correct: false },
            { text: "Gradient hisoblab beradi", correct: false },
            { text: "Loss ni hisoblaydi", correct: false }
          ]
        }
      }
    ]
  },

  {
    id: '00-5', phase: 0, topic: 2, title: "Git & Terminal: Asosiy Buyruqlar", xp: 120,
    steps: [
      {
        type: 'info', title: "Nima uchun Git va Terminal?",
        content: `AI muhandis kundalik ishida **terminal** va **Git** dan foydalanadi:\n\n- **Terminal** — server, Colab, Docker bilan ishlash\n- **Git** — kod versiyalari, jamoa bilan ishlash\n- **Docker** — bir xil muhitda model ishga tushirish\n\nBugun Git workflow ni simulyatsiya qilamiz.`
      },
      {
        type: 'code', title: "Git workflow simulyatsiyasi",
        content: `**Topshiriq:** Quyidagi skript Git buyruqlarini ketma-ket bajarishini ko'rsatadi. Ishga tushiring va commit xabarini toping.`,
        code: `steps = [
    ("git status", "On branch main\\n  modified: model.py"),
    ("git add model.py", ""),
    ("git commit -m 'Add training script'", "[main a1b2c3d] Add training script\\n 1 file changed"),
]

print("=== Git workflow ===")
for cmd, result in steps:
    print(f"\\n$ {cmd}")
    if result:
        print(result)

print("\\n✅ O'zgarishlar saqlandi (commit muvaffaqiyatli)")`,
        successCheck: "commit muvaffaqiyatli"
      },
      {
        type: 'quiz', title: "Git",
        content: "Git haqida savol",
        quiz: {
          question: "Yangi o'zgarishlarni repozitoriyaga yozish uchun qaysi buyruq?",
          options: [
            { text: "git commit", correct: true },
            { text: "git clone", correct: false },
            { text: "git log", correct: false },
            { text: "git branch", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '00-6', phase: 0, topic: 0, title: "Python: Tsikllar va Shartlar", xp: 120,
    steps: [
      {
        type: 'info', title: "Tsikllar va if",
        content: `AI da ma'lumotlar ustida **tsikl** aylantiriladi: dataset, batch, epoch.\n\n- \`for\` — ro'yxat bo'ylab\n- \`if\` — shartli mantiq\n- \`range(n)\` — n marta takrorlash`
      },
      {
        type: 'code', title: "Epoch simulyatsiyasi",
        content: `**Topshiriq:** 3 epoch uchun loss ni kamaytirib chiqaring (o'qitish simulyatsiyasi).`,
        code: `loss = 2.5
epochs = 3

print("Training boshlandi...")
for epoch in range(1, epochs + 1):
    loss = round(loss * 0.6, 3)
    print(f"Epoch {epoch}: loss = {loss}")

if loss < 1.0:
    print("✅ Model yaxshilandi — loss 1.0 dan past")
else:
    print("❌ Yana o'qitish kerak")`,
        successCheck: "loss 1.0 dan past"
      },
      {
        type: 'quiz', title: "Tsikllar",
        content: "",
        quiz: {
          question: "3 marta takrorlash uchun eng qulay konstruksiya?",
          options: [
            { text: "for i in range(3):", correct: true },
            { text: "if i == 3:", correct: false },
            { text: "print(3)", correct: false },
            { text: "while False:", correct: false }
          ]
        }
      }
    ]
  },

  // ─── PHASE 01: MACHINE LEARNING ──────────────────────────────────
  {
    id: '01-2', phase: 1, topic: 0, title: "Klassik ML: Linear Regression", xp: 180,
    steps: [
      {
        type: 'info', title: "Klassik ML — neyron tarmoqdan oldin",
        content: `Deep learning dan oldin **klassik ML** o'rganiladi. U kichik ma'lumotlarda tez va tushunarli ishlaydi.\n\n**Asosiy modellar:**\n- 📈 **Linear Regression** — uzluksiz qiymat bashorati (narx, harorat)\n- 🌳 **Decision Tree / Random Forest** — qaror daraxtlari\n- 🎯 **Logistic Regression** — klassifikatsiya (ha/yo'q)\n\n**Eng muhim tushuncha:** \`train\` (o'qitish) va \`test\` (sinov) ma'lumotini ajratish. Aks holda model **overfitting** bo'ladi — yodlab oladi, lekin yangi ma'lumotda yiqiladi.`
      },
      {
        type: 'code', title: "Linear Regression noldan",
        content: `**Topshiriq:** Eng kichik kvadratlar (least squares) usuli bilan to'g'ri chiziq topib, bashorat qiling.\n\nFormula: \`y = w·x + b\``,
        code: `import numpy as np

# Ma'lumot: tajriba yillari → maosh ($1000)
X = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([30, 35, 42, 51, 58], dtype=float)

# Least squares bilan w (qiyalik) va b (kesim) ni topamiz
w = np.sum((X - X.mean()) * (y - y.mean())) / np.sum((X - X.mean())**2)
b = y.mean() - w * X.mean()

print(f"O'rganilgan model: y = {w:.2f}*x + {b:.2f}")

# Yangi qiymatni bashorat qilish (6 yil tajriba)
x_new = 6
pred = w * x_new + b
print(f"6 yil tajriba uchun bashorat: {pred:.1f}k $")`,
        successCheck: "bashorat"
      },
      {
        type: 'quiz', title: "Overfitting",
        content: "Overfitting nima?",
        quiz: {
          question: "Overfitting deganda nima tushuniladi?",
          options: [
            { text: "Model train datani yodlaydi, lekin yangi datada yomon ishlaydi", correct: true },
            { text: "Model juda sekin o'qiydi", correct: false },
            { text: "Ma'lumot yetishmaydi", correct: false },
            { text: "GPU yetmaydi", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '01-0', phase: 1, topic: 1, title: "Neural Network: Forward Pass", xp: 200,
    steps: [
      {
        type: 'info', title: "Neyron Tarmoq qanday ishlaydi?",
        content: `Neyron tarmoq 3 qismdan iborat:\n1. **Input Layer** — kiruvchi ma'lumot\n2. **Hidden Layer** — yashirin hisoblash\n3. **Output Layer** — natija\n\nHar bir bog'lanishda **weight (vazn)** va **bias** bor. Forward pass — ma'lumot tarmoq orqali o'tishi.`
      },
      {
        type: 'code', title: "Oddiy neyron",
        content: `**Topshiriq:** Bitta neyronning forward pass ini hisoblang.\n\nFormula: \`output = activation(weights · inputs + bias)\``,
        code: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Bitta neyron
inputs  = np.array([1.0, 2.0, 3.0])
weights = np.array([0.5, -0.3, 0.8])
bias    = 0.1

# Forward pass
linear_output = np.dot(inputs, weights) + bias
final_output  = sigmoid(linear_output)

print("Kiruvchi:", inputs)
print("Vaznlar:", weights)
print("Linear natija:", round(linear_output, 4))
print("Sigmoid natija:", round(float(final_output), 4))
print("Neyron qaroriga ko'ra:", "Faol" if final_output > 0.5 else "Nofaol")`,
        successCheck: "Neyron qaroriga"
      },
      {
        type: 'quiz', title: "Forward pass",
        content: "Forward pass nima?",
        quiz: {
          question: "Forward pass deb nimaga aytiladi?",
          options: [
            { text: "Ma'lumotning input dan output gacha o'tishi", correct: true },
            { text: "Gradient hisoblash jarayoni", correct: false },
            { text: "Model deploy qilish jarayoni", correct: false },
            { text: "Loss ni kamaytirish", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '01-1', phase: 1, topic: 1, title: "Neural Network: Loss va Backprop", xp: 200,
    steps: [
      {
        type: 'info', title: "Loss Function va Backpropagation",
        content: `Model o'rganish uchun xatosini bilishi kerak. **Loss function** bu xatoni o'lchaydi.\n\n**MSE (Mean Squared Error):**\n\`loss = mean((predicted - actual)²)\`\n\n**Backpropagation** — loss ni orqaga tarqatib, har bir vaznning ta'sirini hisoblash. Keyin **Gradient Descent** vaznlarni yangilaydi.`
      },
      {
        type: 'code', title: "Loss hisoblash",
        content: `**Topshiriq:** MSE loss ni hisoblang va model yaxshi ishlayotganini tekshiring.`,
        code: `import numpy as np

# Model bashoratlar
predicted = np.array([0.9, 0.2, 0.8, 0.1])
actual    = np.array([1.0, 0.0, 1.0, 0.0])

# MSE Loss
mse = np.mean((predicted - actual) ** 2)

# BCE Loss (Binary Cross Entropy) - klassifikatsiya uchun
bce = -np.mean(actual * np.log(predicted + 1e-8) +
              (1 - actual) * np.log(1 - predicted + 1e-8))

print("Bashorat:", predicted)
print("Haqiqat:", actual)
print(f"MSE Loss: {mse:.4f}")
print(f"BCE Loss: {bce:.4f}")
print("Model sifati:", "Yaxshi" if mse < 0.05 else "Yaxshilash kerak")`,
        successCheck: "MSE Loss:"
      },
      {
        type: 'quiz', title: "Loss funksiyasi",
        content: "Loss = 0 nimani bildiradi?",
        quiz: {
          question: "Loss funksiyasi 0 ga teng bo'lsa...",
          options: [
            { text: "Model barcha bashoratlarni to'g'ri qilmoqda", correct: true },
            { text: "Model o'qishni to'xtatdi", correct: false },
            { text: "Gradient yo'q", correct: false },
            { text: "Bu xato", correct: false }
          ]
        }
      }
    ]
  },

  {
    id: '01-3', phase: 1, topic: 2, title: "PyTorch: Autograd va Gradient", xp: 200,
    steps: [
      {
        type: 'info', title: "PyTorch — chuqur o'qitishning asosi",
        content: `**PyTorch** — Meta yaratgan, AI muhandislar #1 framework.\n\n**Eng kuchli imkoniyati — Autograd:**\nSiz faqat forward pass yozasiz, PyTorch gradientni **avtomatik** hisoblaydi (\`loss.backward()\`).\n\n\`\`\`python\nimport torch\nx = torch.tensor(3.0, requires_grad=True)\ny = x**2          # y = 9\ny.backward()      # dy/dx ni hisobla\nprint(x.grad)     # 6.0  (chunki dy/dx = 2x)\n\`\`\`\n\nQuyida shu jarayonni NumPy bilan "qo'lda" ko'ramiz.`
      },
      {
        type: 'code', title: "Gradientni qo'lda hisoblash",
        content: `**Topshiriq:** \`f(x) = x²\` funksiyasining gradientini hisoblab, gradient descent bilan minimumga (x=0) yaqinlashing.`,
        code: `# PyTorch autograd nima qilishini qo'lda ko'rsatamiz
# f(x) = x^2,  hosila f'(x) = 2x

def f(x):
    return x**2

def grad(x):
    return 2*x          # autograd avtomatik shu natijani beradi

x = 5.0                 # boshlang'ich nuqta
lr = 0.1                # learning rate

print("Gradient descent bilan minimumni qidiramiz:")
for step in range(5):
    g = grad(x)
    x = x - lr * g      # optimizer.step() shuni qiladi
    print(f"  qadam {step+1}: x = {x:.3f},  f(x) = {f(x):.3f}")

print(f"\\nNatija: x minimumga (0) yaqinlashdi -> {x:.3f}")`,
        successCheck: "minimumga"
      },
      {
        type: 'quiz', title: "Autograd",
        content: "loss.backward() nima qiladi?",
        quiz: {
          question: "PyTorch da loss.backward() nima qiladi?",
          options: [
            { text: "Har bir parametr uchun gradientni avtomatik hisoblaydi", correct: true },
            { text: "Modelni saqlaydi", correct: false },
            { text: "Ma'lumotni yuklaydi", correct: false },
            { text: "GPU ni o'chiradi", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '01-4', phase: 1, topic: 3, title: "Hugging Face: Pipeline va Modellar", xp: 180,
    steps: [
      {
        type: 'info', title: "Hugging Face — AI ning npm si",
        content: `**Hugging Face** — minglab tayyor model, dataset va tokenizer joylangan ekotizim.\n\n**3 asosiy qism:**\n- 🤗 **Transformers** — modellar bilan ishlash kutubxonasi\n- 📦 **Hub** — modellar ombori (\`from_pretrained\`)\n- 📊 **Datasets** — tayyor ma'lumot to'plamlari\n\n\`\`\`python\nfrom transformers import pipeline\nclf = pipeline("sentiment-analysis")\nclf("Bu kurs zo'r!")  # [{'label': 'POSITIVE', 'score': 0.99}]\n\`\`\`\n\nBir qator kod bilan tayyor modelni ishlatasiz!`
      },
      {
        type: 'code', title: "Pipeline ni simulyatsiya qilish",
        content: `**Topshiriq:** Sentiment-analysis pipeline qanday ishlashini soddalashtirilgan ko'rinishda quring (kalit so'zlar asosida).`,
        code: `# Hugging Face pipeline g'oyasi: matn -> model -> natija
positive_words = {"zo'r", "ajoyib", "yaxshi", "sevdim", "foydali"}
negative_words = {"yomon", "zerikarli", "qiyin", "xato"}

def sentiment(text):
    words = text.lower().replace("!", "").split()
    score = sum(w in positive_words for w in words) - sum(w in negative_words for w in words)
    label = "POSITIVE" if score >= 0 else "NEGATIVE"
    return {"label": label, "score": round(abs(score) / max(len(words), 1), 2)}

texts = ["Bu kurs juda zo'r va foydali", "Dars zerikarli va qiyin edi"]
print("Sentiment-analysis natijalari:")
for t in texts:
    print(f"  '{t}' -> {sentiment(t)}")`,
        successCheck: "Sentiment-analysis natijalari"
      },
      {
        type: 'quiz', title: "from_pretrained",
        content: "from_pretrained nima qiladi?",
        quiz: {
          question: "model.from_pretrained('bert-base') nima qiladi?",
          options: [
            { text: "Hub dan tayyor o'qitilgan modelni yuklaydi", correct: true },
            { text: "Modelni noldan o'qitadi", correct: false },
            { text: "Modelni o'chiradi", correct: false },
            { text: "GPU sotib oladi", correct: false }
          ]
        }
      }
    ]
  },

  // ─── PHASE 02: LLM ENGINEERING ───────────────────────────────────
  {
    id: '02-0', phase: 2, topic: 0, title: "Transformer: Attention Mexanizmi", xp: 250,
    steps: [
      {
        type: 'info', title: "Attention nima?",
        content: `**Attention** — "Men bankka bordim" gapida "bank" so'zi daryonikmı yoki moliyaviy muassasamı — modelning bu savolga o'zi javob topish qobiliyati.\n\nFormula:\n\`Attention(Q, K, V) = softmax(QK^T / √d_k) × V\`\n\n- **Q** (Query) — "men nima qidiraman?"\n- **K** (Key) — "men nimaman?"\n- **V** (Value) — "men nima beraman?"`
      },
      {
        type: 'code', title: "Soddalashtirilgan Attention",
        content: `**Topshiriq:** Soddalashtirilgan self-attention ni hisoblang.`,
        code: `import numpy as np

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()

# 3 ta token uchun Q, K, V (soddalashtirilgan, d=4)
Q = np.array([[1,0,1,0], [0,1,0,1], [1,1,0,0]], dtype=float)
K = np.array([[1,0,1,0], [0,1,0,1], [0,0,1,1]], dtype=float)
V = np.array([[1,2,3,4], [5,6,7,8], [9,10,11,12]], dtype=float)

d_k = Q.shape[-1]

# Attention scores
scores = Q @ K.T / np.sqrt(d_k)
weights = np.array([softmax(row) for row in scores])
output  = weights @ V

print("Attention weights (kim kimga e'tibor beradi):")
print(np.round(weights, 3))
print("\nAttention output:")
print(np.round(output, 2))`,
        successCheck: "Attention weights"
      },
      {
        type: 'quiz', title: "Attention haqida",
        content: "Attention mexanizmida d_k ga bo'linishning sababi nima?",
        quiz: {
          question: "Nima uchun score larni √d_k ga bo'lamiz?",
          options: [
            { text: "Katta qiymatlarni kichraytirish va gradient barqarorligi uchun", correct: true },
            { text: "Tezlikni oshirish uchun", correct: false },
            { text: "Tasodifiylikni kiritish uchun", correct: false },
            { text: "Mezon yo'q, odatiy", correct: false }
          ]
        }
      }
    ]
  },

  {
    id: '02-1', phase: 2, topic: 1, title: "Tokenizatsiya: BPE Asoslari", xp: 220,
    steps: [
      {
        type: 'info', title: "Tokenizatsiya — matnni raqamga aylantirish",
        content: `LLM matnni emas, **raqamlarni** tushunadi. Tokenizatsiya — matnni token (bo'lak) larga ajratib, har biriga ID berish.\n\n**BPE (Byte Pair Encoding)** — eng ko'p ishlatiladigan usul:\n1. Boshida har bir harf alohida token\n2. Eng ko'p uchraydigan juftlikni birlashtir\n3. Kerakli lug'at hajmiga yetguncha takrorla\n\nShunda "tokenizatsiya" → ["token", "iza", "tsiya"] kabi subword larga bo'linadi. O'zbek tili uchun maxsus tokenizer kerak!`
      },
      {
        type: 'code', title: "Mini-BPE algoritmi",
        content: `**Topshiriq:** BPE ning asosiy qadamini bajaring — matndagi eng ko'p uchraydigan belgilar juftligini toping.`,
        code: `from collections import Counter

word = "salomlashish"
tokens = list(word)   # boshida har bir harf alohida
print("Boshlang'ich tokenlar:", tokens)

# Qo'shni juftliklarni sanaymiz
pairs = Counter(zip(tokens, tokens[1:]))
print("Juftliklar chastotasi:", dict(pairs))

# Eng ko'p uchragan juftlikni birlashtiramiz (BPE qadami)
best = pairs.most_common(1)[0][0]
merged = "".join(best)
print(f"Eng ko'p juftlik: {best} -> birlashtiramiz: '{merged}'")

new_tokens = []
i = 0
while i < len(tokens):
    if i < len(tokens)-1 and (tokens[i], tokens[i+1]) == best:
        new_tokens.append(merged); i += 2
    else:
        new_tokens.append(tokens[i]); i += 1
print("Yangi tokenlar:", new_tokens)`,
        successCheck: "Yangi tokenlar:"
      },
      {
        type: 'quiz', title: "BPE",
        content: "BPE nima qiladi?",
        quiz: {
          question: "BPE (Byte Pair Encoding) nima asosida ishlaydi?",
          options: [
            { text: "Eng ko'p uchraydigan belgilar juftligini birlashtirib subword hosil qiladi", correct: true },
            { text: "Har bir so'zni alohida saqlaydi", correct: false },
            { text: "Matnni rasmga aylantiradi", correct: false },
            { text: "Gradient hisoblaydi", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '02-2', phase: 2, topic: 2, title: "Pre-training: Keyingi Tokenni Bashorat", xp: 250,
    steps: [
      {
        type: 'info', title: "Pre-training — modelni noldan o'qitish",
        content: `**Pre-training** — LLM ning eng qimmat bosqichi. Model **keyingi tokenni bashorat qilish** (next-token prediction) ni o'rganadi.\n\n"Men non yedim" gapida:\n- "Men" → bashorat: "non"\n- "Men non" → bashorat: "yedim"\n\nTrillion token, minglab GPU, oylar davom etadi. Sifat o'lchovi — **perplexity** (qancha past, shuncha yaxshi).`
      },
      {
        type: 'code', title: "Bigram til modeli",
        content: `**Topshiriq:** Oddiy bigram model quring — har bir so'zdan keyin qaysi so'z kelishini chastota asosida bashorat qiling.`,
        code: `from collections import defaultdict, Counter

corpus = "men non yedim men suv ichdim men non oldim".split()

# Bigram: har bir so'zdan keyin nima kelganini sanaymiz
model = defaultdict(Counter)
for a, b in zip(corpus, corpus[1:]):
    model[a][b] += 1

print("Bigram til modeli o'rganildi.")
for word in ["men", "non"]:
    nxt = model[word].most_common(1)[0][0]
    print(f"  '{word}' dan keyin eng ehtimolli: '{nxt}'")

# Bashorat zanjiri
seq = ["men"]
for _ in range(3):
    seq.append(model[seq[-1]].most_common(1)[0][0])
print("Generatsiya:", " ".join(seq))`,
        successCheck: "Bigram til modeli"
      },
      {
        type: 'quiz', title: "Pre-training",
        content: "GPT qanday o'qiydi?",
        quiz: {
          question: "GPT uslubidagi pre-training nimani o'rgatadi?",
          options: [
            { text: "Keyingi tokenni bashorat qilishni", correct: true },
            { text: "Rasmlarni klassifikatsiya qilishni", correct: false },
            { text: "Faqat tarjima qilishni", correct: false },
            { text: "Audio yaratishni", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '02-3', phase: 2, topic: 3, title: "Fine-tuning & LoRA", xp: 260,
    steps: [
      {
        type: 'info', title: "LoRA — arzon fine-tuning",
        content: `Tayyor modelni o'z vazifangizga moslash — **fine-tuning**. Lekin butun modelni (milliardlab parametr) o'qitish juda qimmat.\n\n**LoRA (Low-Rank Adaptation):**\nKatta vazn matritsasi \`W\` ni qotirib qo'yamiz, faqat kichik ikkita matritsa \`A\` va \`B\` ni o'qitamiz: \`W' = W + A·B\`.\n\nNatijada o'qitiladigan parametrlar **100x-1000x kamayadi** — bitta GPU da ham ishlaydi. QLoRA esa bunga 4-bit quantization qo'shadi.`
      },
      {
        type: 'code', title: "LoRA parametr tejovini hisoblash",
        content: `**Topshiriq:** To'liq fine-tuning va LoRA da o'qitiladigan parametrlar sonini solishtiring.`,
        code: `# Vazn matritsasi: 4096 x 4096
d = 4096
full_params = d * d
print(f"To'liq fine-tuning: {full_params:,} parametr")

# LoRA: rank r ta kichik matritsa (A: d x r, B: r x d)
for r in [4, 8, 16]:
    lora_params = 2 * d * r
    reduction = full_params / lora_params
    print(f"LoRA (rank={r}): {lora_params:,} parametr  ->  {reduction:.0f}x kam")

print("\\nXulosa: LoRA bilan juda kam resurs bilan fine-tuning mumkin")`,
        successCheck: "LoRA"
      },
      {
        type: 'quiz', title: "LoRA",
        content: "LoRA nega arzon?",
        quiz: {
          question: "LoRA nima uchun kam resurs talab qiladi?",
          options: [
            { text: "Faqat kichik adapter matritsalarini o'qitadi, asosiy vaznlar qotirilgan", correct: true },
            { text: "Modelni o'chiradi", correct: false },
            { text: "Ma'lumotni kamaytiradi", correct: false },
            { text: "GPU ni 2 baravar oshiradi", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '02-4', phase: 2, topic: 4, title: "RLHF & Alignment", xp: 260,
    steps: [
      {
        type: 'info', title: "RLHF — modelni insonga moslash",
        content: `Pre-train qilingan model ba'zan foydasiz yoki zararli javob beradi. **Alignment** — uni insoniy qadriyatlarga moslash.\n\n**RLHF (Reinforcement Learning from Human Feedback):**\n1. Inson ikki javobni solishtiradi (qaysi biri yaxshi?)\n2. Shu asosda **reward model** o'qitiladi\n3. LLM reward ni maksimal qilishga o'rgatiladi\n\nChatGPT aynan shu usulda. **DPO** — bu jarayonning soddaroq, reward model talab qilmaydigan varianti.`
      },
      {
        type: 'code', title: "Reward model g'oyasi",
        content: `**Topshiriq:** Inson afzalliklari (preference) asosida javoblarni baholaydigan oddiy reward funksiyani quring.`,
        code: `# Reward model: yaxshi javob xususiyatlarini baholaydi
def reward(answer):
    score = 0
    if answer.get("foydali"):   score += 2
    if answer.get("xavfsiz"):   score += 2
    if answer.get("qisqa"):     score += 1
    if answer.get("qo'pol"):    score -= 3
    return score

candidates = [
    {"text": "To'liq, xavfsiz javob", "foydali": True, "xavfsiz": True, "qisqa": True},
    {"text": "Qo'pol javob",          "foydali": True, "xavfsiz": False, "qo'pol": True},
]

print("RLHF reward baholash:")
ranked = sorted(candidates, key=reward, reverse=True)
for c in ranked:
    print(f"  reward={reward(c):+d}  ->  {c['text']}")
print(f"\\nModel tanlaydi: '{ranked[0]['text']}'")`,
        successCheck: "RLHF reward"
      },
      {
        type: 'quiz', title: "RLHF",
        content: "RLHF maqsadi?",
        quiz: {
          question: "RLHF ning asosiy maqsadi nima?",
          options: [
            { text: "Modelni insoniy afzallik va qadriyatlarga moslash", correct: true },
            { text: "Modelni tezlashtirish", correct: false },
            { text: "Lug'atni kattalashtirish", correct: false },
            { text: "GPU tejash", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '02-5', phase: 2, topic: 5, title: "Prompt Engineering: CoT va Few-shot", xp: 200,
    steps: [
      {
        type: 'info', title: "Prompt Engineering — modeldan maksimal natija",
        content: `Bir xil model, lekin yaxshi **prompt** bilan ancha aqlli javob beradi.\n\n**Asosiy texnikalar:**\n- 🎯 **Zero-shot** — shunchaki savol berish\n- 📚 **Few-shot** — bir nechta misol ko'rsatish\n- 🧠 **Chain-of-Thought (CoT)** — "qadam-baqadam o'ylab ko'r" deyish\n- ⚙️ **System prompt** — modelning rolini belgilash\n\nMurakkab masalalarda CoT to'g'rilikni keskin oshiradi.`
      },
      {
        type: 'code', title: "Few-shot prompt qurish",
        content: `**Topshiriq:** Few-shot prompt strukturasini quring — misollar + yangi savolni birlashtiring.`,
        code: `# Few-shot prompt: model misollardan namunani o'rganadi
examples = [
    ("salom", "POSITIVE"),
    ("yomon xizmat", "NEGATIVE"),
    ("ajoyib mahsulot", "POSITIVE"),
]

def build_prompt(examples, query):
    p = "Matnning kayfiyatini aniqla:\\n\\n"
    for text, label in examples:
        p += f"Matn: {text}\\nJavob: {label}\\n\\n"
    p += f"Matn: {query}\\nJavob:"
    return p

prompt = build_prompt(examples, "juda foydali kurs")
print("=== Few-shot prompt ===")
print(prompt)
print("\\n(Model bu namunaga qarab 'POSITIVE' deb bashorat qiladi)")`,
        successCheck: "Few-shot prompt"
      },
      {
        type: 'quiz', title: "Chain-of-Thought",
        content: "CoT nima beradi?",
        quiz: {
          question: "Chain-of-Thought (CoT) prompt nimaga yordam beradi?",
          options: [
            { text: "Modelni qadam-baqadam fikrlashga undab, murakkab masalalarda to'g'rilikni oshiradi", correct: true },
            { text: "Modelni o'chiradi", correct: false },
            { text: "Tokenlarni kamaytiradi", correct: false },
            { text: "GPU ni isitadi", correct: false }
          ]
        }
      }
    ]
  },

  // ─── PHASE 03: MLOPS ─────────────────────────────────────────────
  {
    id: '03-1', phase: 3, topic: 0, title: "Model Baholash: MMLU va Metrikalar", xp: 200,
    steps: [
      {
        type: 'info', title: "Model qanchalik yaxshi?",
        content: `Modelni deploy qilishdan oldin uni **baholash** kerak.\n\n**Standart benchmarklar:**\n- 📚 **MMLU** — 57 soha bo'yicha bilim testi\n- 💻 **HumanEval** — kod yozish qobiliyati\n- 🎯 **Accuracy, F1** — klassifikatsiya sifati\n\nO'zbek tili uchun tayyor benchmark yo'q — **o'z eval to'plamingizni** yaratishingiz kerak. Eng katta xavf — **hallucination** (ishonch bilan noto'g'ri javob).`
      },
      {
        type: 'code', title: "Accuracy va F1 hisoblash",
        content: `**Topshiriq:** Model bashoratlarini haqiqat bilan solishtirib, accuracy va F1 metrikalarini hisoblang.`,
        code: `# Model javoblari (1 = to'g'ri sinf, 0 = noto'g'ri)
y_true = [1, 0, 1, 1, 0, 1, 0, 0]
y_pred = [1, 0, 1, 0, 0, 1, 1, 0]

TP = sum(t==1 and p==1 for t,p in zip(y_true,y_pred))
TN = sum(t==0 and p==0 for t,p in zip(y_true,y_pred))
FP = sum(t==0 and p==1 for t,p in zip(y_true,y_pred))
FN = sum(t==1 and p==0 for t,p in zip(y_true,y_pred))

accuracy = (TP+TN) / len(y_true)
precision = TP / (TP+FP)
recall = TP / (TP+FN)
f1 = 2*precision*recall / (precision+recall)

print(f"Accuracy:  {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall:    {recall:.2f}")
print(f"F1 score:  {f1:.2f}")`,
        successCheck: "F1 score:"
      },
      {
        type: 'quiz', title: "Hallucination",
        content: "Hallucination nima?",
        quiz: {
          question: "LLM da 'hallucination' nima?",
          options: [
            { text: "Model ishonch bilan noto'g'ri ma'lumot to'qib chiqarishi", correct: true },
            { text: "Model sekin ishlashi", correct: false },
            { text: "GPU qizishi", correct: false },
            { text: "Tokenlar tugashi", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '03-2', phase: 3, topic: 1, title: "Quantization: Modelni Kichraytirish", xp: 200,
    steps: [
      {
        type: 'info', title: "Quantization — 16-bit dan 4-bit ga",
        content: `Katta modellar GPU xotirasiga sig'maydi. **Quantization** — vaznlarni kamroq bit bilan saqlash.\n\n- FP16 (16-bit) → INT4 (4-bit): hajm **4x kichrayadi**\n- Tezlik oshadi, sifat minimal yo'qoladi\n- Telefonda ishlash uchun zarur\n\nFormatlar: **GGUF** (llama.cpp), **GPTQ**, **AWQ**. 70B model 4-bit da ~40GB → 35GB emas, balki bitta GPU ga sig'adi.`
      },
      {
        type: 'code', title: "Quantization simulyatsiyasi",
        content: `**Topshiriq:** FP32 vaznlarni INT8 ga "quantize" qilib, xotira tejovini va xatolikni hisoblang.`,
        code: `import numpy as np

# Asl vaznlar (FP32)
weights = np.array([0.12, -0.87, 0.45, -0.33, 0.91, -0.05])

# INT8 quantization: [-127, 127] oralig'iga siqamiz
scale = np.abs(weights).max() / 127
q = np.round(weights / scale).astype(np.int8)
dequant = q * scale     # qayta tiklash

print("Asl (FP32):   ", np.round(weights, 3))
print("Quantized INT8:", q)
print("Tiklangan:     ", np.round(dequant, 3))

err = np.abs(weights - dequant).mean()
print(f"\\nO'rtacha xatolik: {err:.4f} (juda kichik)")
print(f"Xotira: 32-bit -> 8-bit = {32/8:.0f}x kichrayadi")`,
        successCheck: "kichrayadi"
      },
      {
        type: 'quiz', title: "Quantization",
        content: "Quantization nima beradi?",
        quiz: {
          question: "Quantization ning asosiy foydasi nima?",
          options: [
            { text: "Model hajmini kichraytiradi va tezlashtiradi, sifat deyarli saqlanadi", correct: true },
            { text: "Modelni aniqroq qiladi", correct: false },
            { text: "Ko'proq GPU talab qiladi", correct: false },
            { text: "Tokenlarni ko'paytiradi", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '03-3', phase: 3, topic: 2, title: "Inference: KV Cache va Batching", xp: 220,
    steps: [
      {
        type: 'info', title: "Inference ni tezlashtirish",
        content: `Modelni **tez ishlatish** (inference) — production da eng muhim.\n\n**Asosiy texnikalar:**\n- 💾 **KV Cache** — avval hisoblangan attention natijalarini saqlash (har tokenni qaytadan hisoblamaslik)\n- 📦 **Batching** — bir nechta so'rovni birga qayta ishlash\n- ⚡ **vLLM** — PagedAttention bilan eng tezkor engine\n\nKV cache bo'lmasa, har yangi token uchun butun ketma-ketlik qayta hisoblanardi.`
      },
      {
        type: 'code', title: "KV cache tejovini ko'rsatish",
        content: `**Topshiriq:** KV cache bilan va usiz qancha hisoblash kerakligini solishtiring.`,
        code: `# n ta token generatsiya qilamiz
n = 10

# KV cache YO'Q: har qadamda butun ketma-ketlikni qayta hisoblash
without_cache = sum(range(1, n+1))   # 1+2+...+n

# KV cache BOR: har qadamda faqat 1 ta yangi token
with_cache = n

print(f"{n} token generatsiya qilamiz:")
print(f"  KV cache YO'Q: {without_cache} ta hisoblash")
print(f"  KV cache BOR:  {with_cache} ta hisoblash")
print(f"  Tezlanish: {without_cache/with_cache:.1f}x")
print("\\nShuning uchun barcha LLM serverlar KV cache ishlatadi")`,
        successCheck: "Tezlanish:"
      },
      {
        type: 'quiz', title: "KV Cache",
        content: "KV cache nima qiladi?",
        quiz: {
          question: "KV cache inference ni qanday tezlashtiradi?",
          options: [
            { text: "Avval hisoblangan attention key/value larni saqlab, qayta hisoblashni oldini oladi", correct: true },
            { text: "Modelni kichraytiradi", correct: false },
            { text: "Ko'proq token yaratadi", correct: false },
            { text: "GPU sonini oshiradi", correct: false }
          ]
        }
      }
    ]
  },

  // ─── PHASE 03: API & SERVING ─────────────────────────────────────
  {
    id: '03-0', phase: 3, topic: 3, title: "FastAPI: LLM API Yaratish", xp: 200,
    steps: [
      {
        type: 'info', title: "FastAPI — Python ning eng tezkor API freymvorki",
        content: `Siz LLM ni o'qitdingiz. Endi uni dunyo bilan ulash uchun **API** kerak.\n\nFastAPI afzalliklari:\n- ⚡ Eng tezkor Python API (Starlette ustida)\n- 📖 Avtomatik Swagger dokumentatsiya\n- 🔄 Async/await qo'llab-quvvatlaydi\n- 🤖 OpenAI format bilan mos keladi\n\nHar qanday LLM servisi (vLLM, Ollama) FastAPI ishlatadi.`
      },
      {
        type: 'code', title: "Oddiy LLM API",
        content: `**Topshiriq:** FastAPI strukturasini o'rganing — bu haqiqiy LLM API ning skeleti.`,
        code: `# FastAPI LLM API skeleti
# (Bu brauzernda ishlamaydi, lekin strukturani o'rganing)

api_code = """
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="O'zbek LLM API")

class ChatRequest(BaseModel):
    message: str
    max_tokens: int = 512
    temperature: float = 0.7

class ChatResponse(BaseModel):
    response: str
    tokens_used: int

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Bu yerda LLM ga so'rov yuboriladi
    response = f"Siz aytdingiz: {request.message}"
    return ChatResponse(
        response=response,
        tokens_used=len(request.message.split())
    )

@app.get("/health")
async def health():
    return {"status": "ok", "model": "uz-llm-v1"}
"""

print("FastAPI LLM API strukturasi:")
print("=" * 40)
# Endpointlarni simulyatsiya qilish
endpoints = [
    ("POST", "/chat", "LLM bilan suhbat"),
    ("GET",  "/health", "Server holati"),
    ("GET",  "/models", "Mavjud modellar"),
]
for method, path, desc in endpoints:
    print(f"  {method:6} {path:20} → {desc}")
print("=" * 40)
print("API tayyor! http://localhost:8000/docs")`,
        successCheck: "FastAPI LLM API"
      },
      {
        type: 'quiz', title: "FastAPI",
        content: "Qaysi HTTP method yangi ma'lumot yuborish uchun ishlatiladi?",
        quiz: {
          question: "LLM ga so'rov yuborish uchun qaysi HTTP method?",
          options: [
            { text: "POST", correct: true },
            { text: "GET", correct: false },
            { text: "DELETE", correct: false },
            { text: "PUT", correct: false }
          ]
        }
      }
    ]
  },

  // ─── PHASE 04: AGENT ─────────────────────────────────────────────
  {
    id: '04-0', phase: 4, topic: 0, title: "RAG: Hujjatlardan Javob Topish", xp: 300,
    steps: [
      {
        type: 'info', title: "RAG nima va nima uchun kerak?",
        content: `**RAG** (Retrieval-Augmented Generation) — LLM ga uning o'qitilishidan keyingi bilimlarni berish usuli.\n\n**Muammo:** GPT-4 2023 da to'xtatilgan. U 2024 yangiliklari haqida bilmaydi.\n\n**RAG yechimi:**\n1. 📄 Hujjatlarni bo'laklarga ajrat (chunking)\n2. 🔢 Har bir bo'lakni vektorga ayla (embedding)\n3. 💾 Vektorlarni bazada saqlash (ChromaDB, FAISS)\n4. ❓ Savol kelganda — eng yaqin bo'lakni top\n5. 🤖 LLM ga savol + topilgan kontekstni ber`
      },
      {
        type: 'code', title: "RAG simulyatsiyasi",
        content: `**Topshiriq:** Oddiy RAG tizimini simulyatsiya qiling — savol bo'yicha eng mos hujjatni toping.`,
        code: `import numpy as np

# "Vectorstore" dagi hujjatlar (embedding bilan)
documents = [
    {"text": "PyTorch Meta tomonidan yaratilgan deep learning kutubxonasi", "vec": [0.9, 0.1, 0.2]},
    {"text": "LoRA - kichik adapter matritsalar orqali fine-tuning usuli", "vec": [0.1, 0.9, 0.1]},
    {"text": "FastAPI Python da eng tezkor REST API freymvorki",          "vec": [0.1, 0.1, 0.9]},
    {"text": "vLLM - production uchun mo'ljallangan LLM inference engine", "vec": [0.2, 0.3, 0.8]},
]

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve(query_vec, top_k=2):
    scored = [(cosine_similarity(query_vec, d["vec"]), d["text"]) for d in documents]
    return sorted(scored, reverse=True)[:top_k]

# Savol: FastAPI haqida
query = [0.1, 0.0, 1.0]
print("Savol vektori:", query)
print("\nEng mos hujjatlar (RAG natijasi):")
for score, text in retrieve(query):
    print(f"  [{score:.3f}] {text}")`,
        successCheck: "RAG natijasi"
      },
      {
        type: 'quiz', title: "RAG haqida",
        content: "RAG da 'Retrieval' qadami nima qiladi?",
        quiz: {
          question: "RAG ning Retrieval qadami nima?",
          options: [
            { text: "Savolga mos hujjatlarni vektorlar orqali topish", correct: true },
            { text: "LLM ni fine-tuning qilish", correct: false },
            { text: "Hujjatlarni tarjima qilish", correct: false },
            { text: "API so'rov yuborish", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '04-1', phase: 4, topic: 1, title: "AI Agent: Tool Calling", xp: 320,
    steps: [
      {
        type: 'info', title: "AI Agent — o'zi qaror qiladigan LLM",
        content: `**Agent = LLM + tools + memory.** Oddiy LLM faqat matn yozadi; agent esa **harakat qiladi**: qidiruv, kod ishga tushirish, API chaqirish.\n\n**ReAct sxemasi:**\n1. 🤔 **Reason** — "menga ob-havo kerak"\n2. 🔧 **Act** — \`get_weather("Toshkent")\` tool ni chaqir\n3. 👀 **Observe** — natijani ko'r\n4. 🔁 Maqsadga yetguncha takrorla\n\nLangChain va LlamaIndex shu naqshни osonlashtiradi.`
      },
      {
        type: 'code', title: "Oddiy agent + tools",
        content: `**Topshiriq:** Agent qaysi tool ni chaqirishni tanlaydigan oddiy "router" quring.`,
        code: `# Agent foydalanadigan tool lar
def calculator(expr): return eval(expr)
def weather(city):    return f"{city}: 28°C, quyoshli"

tools = {"hisobla": calculator, "obhavo": weather}

def agent(query):
    # LLM qaysi tool kerakligini "tanlaydi" (bu yerda oddiy qoida bilan)
    if any(c.isdigit() for c in query) and ("+" in query or "*" in query):
        expr = "".join(c for c in query if c in "0123456789+-*/")
        return f"[hisobla tool] -> {tools['hisobla'](expr)}"
    if "ob-havo" in query or "harorat" in query:
        return f"[obhavo tool] -> {tools['obhavo']('Toshkent')}"
    return "[javob] Bu savolga tool kerak emas"

print("Agent ishlamoqda:")
for q in ["2+2*3 nechchi?", "Toshkentda ob-havo qanday?"]:
    print(f"  Savol: {q}")
    print(f"  Agent: {agent(q)}")`,
        successCheck: "Agent ishlamoqda"
      },
      {
        type: 'quiz', title: "Agent",
        content: "Agent nima bilan farq qiladi?",
        quiz: {
          question: "AI Agent oddiy LLM dan nimasi bilan farq qiladi?",
          options: [
            { text: "Tool va memory bilan harakat qila oladi (qidiruv, kod, API)", correct: true },
            { text: "Faqat tezroq yozadi", correct: false },
            { text: "Internetsiz ishlaydi", correct: false },
            { text: "Hech qanday farqi yo'q", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '04-2', phase: 4, topic: 2, title: "On-device AI: llama.cpp va GGUF", xp: 260,
    steps: [
      {
        type: 'info', title: "Modelni telefon va kompyuterda ishlatish",
        content: `LLM ni **internet siz**, qurilmaning o'zida ishlatish mumkin — maxfiylik va arzonlik uchun.\n\n**Asosiy vositalar:**\n- 🦙 **llama.cpp** — har qanday qurilmada (C++ da), GGUF format\n- 📱 **MLC-LLM** — Android/iOS\n- 🍎 **CoreML / Ollama** — Mac\n\nSiri: 7B model 4-bit GGUF da ~4GB → zamonaviy telefonga sig'adi. RAM va tezlik asosiy cheklov.`
      },
      {
        type: 'code', title: "Qurilmaga sig'ishini hisoblash",
        content: `**Topshiriq:** Turli model va quantization uchun RAM talabini hisoblab, qaysi qurilmaga sig'ishini aniqlang.`,
        code: `# Parametr soni (milliard) va bit
models = [("1B", 1), ("3B", 3), ("7B", 7), ("13B", 13)]
bits = 4   # GGUF Q4 quantization

print(f"{bits}-bit (GGUF) da RAM talabi:\\n")
for name, params_b in models:
    ram_gb = params_b * 1e9 * bits / 8 / 1e9   # baytdan GB ga
    device = "📱 Telefon" if ram_gb <= 4 else ("💻 Laptop" if ram_gb <= 8 else "🖥️ Server")
    print(f"  {name:4} model -> {ram_gb:.1f} GB RAM  ->  {device}")`,
        successCheck: "RAM talabi"
      },
      {
        type: 'quiz', title: "On-device",
        content: "llama.cpp afzalligi?",
        quiz: {
          question: "On-device (qurilmada) AI ning asosiy afzalligi nima?",
          options: [
            { text: "Internetsiz, maxfiy va bepul ishlaydi", correct: true },
            { text: "Har doim aniqroq", correct: false },
            { text: "Cheksiz katta model", correct: false },
            { text: "GPU shart emas degani sifat yo'qoladi", correct: false }
          ]
        }
      }
    ]
  },
  {
    id: '04-3', phase: 4, topic: 3, title: "O'zbek Super Model: Yakuniy Loyiha", xp: 400,
    steps: [
      {
        type: 'info', title: "Hammasini birlashtirish",
        content: `Tabriklaymiz — yakuniy bosqichga yetdingiz! Endi barcha bilimlarni birlashtirib **o'zbek LLM** quramiz:\n\n1. 📚 **Dataset** — o'zbekcha matn yig'ish va tozalash\n2. 🔤 **Tokenizer** — o'zbek tili uchun BPE\n3. 🎯 **Fine-tune** — Llama ni QLoRA bilan o'zbekchaga moslash\n4. 📦 **Quantize** — GGUF Q4 ga siqish\n5. 🚀 **Deploy** — web (FastAPI) + telefon (llama.cpp)\n\nBu — past-resurs til uchun real AI mahsuloti yaratish yo'li.`
      },
      {
        type: 'code', title: "Loyiha pipeline tekshiruvi",
        content: `**Topshiriq:** O'zbek LLM loyihasining bosqichlarini ketma-ket tekshirib, tayyorligini hisoblang.`,
        code: `# O'zbek LLM loyihasi bosqichlari va holati
pipeline = [
    ("Dataset yig'ish",      True,  "500M token o'zbekcha matn"),
    ("Tokenizer (BPE)",      True,  "32k lug'at, o'zbekcha"),
    ("QLoRA fine-tuning",    True,  "Llama-3 8B + adapter"),
    ("Baholash (eval)",      True,  "O'zbek MMLU: 61%"),
    ("Quantization (GGUF)",  True,  "Q4 -> 4.5 GB"),
    ("Deploy (web+mobil)",   True,  "FastAPI + llama.cpp"),
]

done = sum(ok for _, ok, _ in pipeline)
print("=== O'ZBEK LLM LOYIHASI ===")
for i, (step, ok, detail) in enumerate(pipeline, 1):
    mark = "✅" if ok else "⬜"
    print(f"  {mark} {i}. {step:22} {detail}")

print(f"\\nTayyorlik: {done}/{len(pipeline)} bosqich ({done/len(pipeline)*100:.0f}%)")
if done == len(pipeline):
    print("🎉 O'zbek AI modeli deploy uchun tayyor!")`,
        successCheck: "O'zbek AI modeli deploy uchun tayyor"
      },
      {
        type: 'quiz', title: "Yakuniy",
        content: "Past-resurs til uchun eng samarali yo'l?",
        quiz: {
          question: "O'zbekdek past-resurs til uchun model qurishda eng amaliy yo'l qaysi?",
          options: [
            { text: "Tayyor modelni (Llama) QLoRA bilan fine-tune qilish", correct: true },
            { text: "Noldan trillion token bilan pre-train qilish", correct: false },
            { text: "Faqat tarjimadan foydalanish", correct: false },
            { text: "Modelsiz qoida yozish", correct: false }
          ]
        }
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────
// KURS 2: Sun'iy Intellekt Asoslari
// Format: har mavzu = video + nazariya + quiz. Mavzular sekin qo'shiladi.
// ─────────────────────────────────────────────────────────────────────
const promptEngLessons: Omit<Lesson, 'course'>[] = [
  // ═══ 1-MODUL: ABRAKADABRA (Playgrounds & Generative Tools) ═══════════
  {
    id: 'aia-1', phase: 0, topic: 0, title: "AI bilan to'g'ri gaplashish (Prompt asoslari)", xp: 100,
    steps: [
      { type: 'video', title: "Video dars: AI Asoslari va Prompt Mindset",
        content: `Videoni tomosha qiling, so'ng nazariyani o'qib testdan o'ting. Bu darsda kod yozilmaydi — AI bilan to'g'ri "gaplashishni" o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: AI qatlamlari va zanjir",
        content: `**AI nima o'zi? Eng oddiy qilib:**\nAI (sun'iy intellekt) — odamga o'xshab "o'ylaydigan" kompyuter dasturi. Uning ichida bir nechta qatlam bor:\n- 🧠 **AI** — eng umumiy nom (aqlli dastur)\n- 📊 **ML (mashina o'rganishi)** — misollardan o'zi o'rganadigan dastur\n- 💬 **LLM (katta til modeli)** — matn bilan ishlaydigan AI; ChatGPT va Claude shular\n\n**AI qanday ishlaydi?** Juda sodda: \`Siz yozasiz (prompt) → AI o'ylaydi → javob beradi\`. Ya'ni qanday so'rasangiz — shunday javob olasiz. Demak hammasi siz bergan **buyruq (prompt)** sifatiga bog'liq.\n\n**Yaxshi buyruq yozishning 4 qoidasi (RTFC):**\n- 🎭 **Rol bering:** "Sen tajribali marketologsan"\n- 🎯 **Vazifani ayting:** "reklama matni yoz"\n- 📐 **Formatni ko'rsating:** "3 ta gap, ro'yxat ko'rinishida"\n- 🚧 **Cheklov qo'ying:** "150 so'zdan oshmasin, rasmiy ohangda"` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Bepul vositalar:** ChatGPT, Claude, Gemini — hammasi bepul ishlaydi.\n\n**Amaliyot — yomon buyruqdan yaxshisiga:**\n- ❌ Yomon: "marketing haqida yoz"\n- ✅ Yaxshi: "Sen marketing bo'yicha mutaxassissan. Yangi qahvaxona uchun Instagram post yoz. Format: 3 ta gap + 3 ta hashtag. Ohang: quvnoq."\n\n**Iteratsiya (javobni bosqichma-bosqich yaxshilash)** — birinchi javob kamdan-kam ideal bo'ladi. Shuning uchun: avval umumiy so'rang → keyin "qisqaroq qil" deng → keyin "hissiyotliroq qil" deng. Eng yaxshi natija odatda 2–3-urinishda chiqadi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "RTFC promptda \"R\" nimani bildiradi?", options: [ { text: "Role (rol)", correct: true }, { text: "Random", correct: false }, { text: "Result", correct: false }, { text: "Rate", correct: false } ] },
          { question: "AI zanjiri qanday?", options: [ { text: "Input → Model → Output", correct: true }, { text: "Output → Input → Model", correct: false }, { text: "Model → Internet → Output", correct: false }, { text: "Faqat Output", correct: false } ] },
          { question: "LLM qaysi qatlamga kiradi?", options: [ { text: "Deep Learning", correct: true }, { text: "Excel", correct: false }, { text: "Brauzer", correct: false }, { text: "Antivirus", correct: false } ] },
          { question: "Prompt sifati nimaga ta'sir qiladi?", options: [ { text: "Javob sifatiga", correct: true }, { text: "Internet tezligiga", correct: false }, { text: "Ekran rangiga", correct: false }, { text: "Hech narsaga", correct: false } ] },
          { question: "\"Constraint\" nima?", options: [ { text: "Cheklov (uzunlik, ohang, qoidalar)", correct: true }, { text: "Modelning nomi", correct: false }, { text: "Internet manzili", correct: false }, { text: "Fayl turi", correct: false } ] },
          { question: "Iteratsiya nima beradi?", options: [ { text: "Javobni qadama-qadam yaxshilaydi", correct: true }, { text: "Modelni o'chiradi", correct: false }, { text: "Internetni tezlashtiradi", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Qaysi bepul LLM vositasi?", options: [ { text: "Claude", correct: true }, { text: "Photoshop", correct: false }, { text: "Excel", correct: false }, { text: "Notepad", correct: false } ] },
          { question: "\"Act as marketing expert\" — bu RTFC ning qaysi qismi?", options: [ { text: "Role", correct: true }, { text: "Format", correct: false }, { text: "Constraint", correct: false }, { text: "Task", correct: false } ] },
          { question: "ML oddiy dasturdan farqi?", options: [ { text: "Ma'lumotdan o'zi o'rganadi", correct: true }, { text: "Tezroq ishlaydi", correct: false }, { text: "Internet shart emas", correct: false }, { text: "Farqi yo'q", correct: false } ] },
          { question: "Yaxshi prompt nimaga ega bo'lishi kerak?", options: [ { text: "Rol, vazifa, format va cheklov", correct: true }, { text: "Faqat bitta so'z", correct: false }, { text: "Ko'p emoji", correct: false }, { text: "Hech qanday ko'rsatma", correct: false } ] },
        ] },
    ]
  },
  {
    id: 'aia-2', phase: 0, topic: 1, title: "AI qanday \"o'ylaydi\"? (Token va sozlamalar)", xp: 120,
    steps: [
      { type: 'video', title: "Video dars: LLM Kapoti Ostida va Nazorat",
        content: `LLM ichida nima sodir bo'lishini va uni qanday boshqarishni o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Token va bashorat",
        content: `**AI aslida nima qiladi?** Juda oddiy ish: u sizning matningizdan keyin **qaysi so'z kelishini taxmin qiladi** — xuddi telefoningiz klaviaturasi keyingi so'zni taklif qilgandek. Faqat AI buni ancha aqlli qiladi. "Osmon ko'k ___" deganda u "rang/edi/tusda" ichidan eng ehtimollisini tanlaydi.\n\n**Token (so'z bo'lagi)** — AI matnni mayda bo'laklarga bo'lib oladi (ba'zan butun so'z, ba'zan yarmi). U faqat shu bo'laklar bilan ishlaydi.\n\n**Asosiy sozlama — Temperature (ijodiylik darajasi):**\n- 🌡️ **0** = jiddiy buxgalterdek — aniq, qat'iy, har safar bir xil javob.\n- 🌡️ **Yuqori** = ijodkor rassomdek — erkin, xilma-xil, ijodiy javob.\n\n**Hallucination (xato to'qish)** — AI ba'zan ishonch bilan **noto'g'ri** javob beradi. Sababi: u "haqiqatda biladiganini" emas, "eng ehtimolli"ni yozadi. Shuning uchun muhim faktlarni doim tekshirib ko'ring.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vositalar:** Google AI Studio (bepul sinov muhiti), Anthropic Workbench.\n\n**Amaliyot:**\n- AI Studio'da **Temperature**ni o'zgartirib ko'ring — javob qanchalik "ijodiy" yoki "qat'iy" bo'lishini his qiling.\n- AI'dan javobni **JSON** ko'rinishida so'rashni o'rganing — bu dasturlar uchun kerak bo'ladi:\n\n\`\`\`\nFaqat JSON qaytar:\n{ "ism": "...", "yosh": ..., "shahar": "..." }\n\`\`\`\n\n**JSON** — kompyuter osongina o'qiy oladigan tartibli format (jadval kabi). Keyingi darslarda botlaringiz aynan shu formatda "gaplashadi".\n\n💡 **Hayotiy misol:** Temperature'ni 0 qilsangiz — narx hisoblaydigan jiddiy yordamchi olasiz; yuqori qilsangiz — slogan o'ylaydigan ijodkor olasiz. Vazifaga qarab tanlaysiz.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "LLM asosan nima qiladi?", options: [ { text: "Keyingi tokenni ehtimollik bilan bashorat qiladi", correct: true }, { text: "Internetdan nusxalaydi", correct: false }, { text: "Bazadan qidiradi", correct: false }, { text: "Tasodifiy harf teradi", correct: false } ] },
          { question: "Temperature = 0 nimani bildiradi?", options: [ { text: "Qat'iy/aniq javob", correct: true }, { text: "Eng ijodiy javob", correct: false }, { text: "Model o'chiq", correct: false }, { text: "Internet yo'q", correct: false } ] },
          { question: "Token nima?", options: [ { text: "Matnning kichik bo'lagi (AI shular bilan ishlaydi)", correct: true }, { text: "Rasm formati", correct: false }, { text: "Internet manzili", correct: false }, { text: "Parol turi", correct: false } ] },
          { question: "Hallucination nima?", options: [ { text: "Model ishonch bilan noto'g'ri javob to'qishi", correct: true }, { text: "Model sekin ishlashi", correct: false }, { text: "Internet uzilishi", correct: false }, { text: "Token tugashi", correct: false } ] },
          { question: "Yuqori Temperature nimaga olib keladi?", options: [ { text: "Ko'proq ijodiy/tasodifiy javob", correct: true }, { text: "Doim bir xil javob", correct: false }, { text: "Model tezlashadi", correct: false }, { text: "Xatolik", correct: false } ] },
          { question: "JSON nima uchun kerak?", options: [ { text: "Mashina o'qiy oladigan tartibli format", correct: true }, { text: "Rasm formati", correct: false }, { text: "Video kodek", correct: false }, { text: "Parol turi", correct: false } ] },
          { question: "Temperature sozlamasi nimani o'zgartiradi?", options: [ { text: "Javobning ijodiylik darajasini", correct: true }, { text: "Internet tezligini", correct: false }, { text: "Ekran rangini", correct: false }, { text: "Fayl hajmini", correct: false } ] },
          { question: "Qaysi bepul API muhiti?", options: [ { text: "Google AI Studio", correct: true }, { text: "Microsoft Word", correct: false }, { text: "Telegram", correct: false }, { text: "Chrome", correct: false } ] },
          { question: "Model raqam bilan ishlaydimi yoki matn bilan?", options: [ { text: "Raqam bilan (tokenlar raqamga aylanadi)", correct: true }, { text: "Faqat matn bilan", correct: false }, { text: "Faqat rasm bilan", correct: false }, { text: "Hech qaysi", correct: false } ] },
          { question: "Hallucination'ni kamaytirish uchun nima qilish kerak?", options: [ { text: "Faktlarni tekshirish va aniq kontekst berish", correct: true }, { text: "Temperature'ni maksimal qilish", correct: false }, { text: "Promptni o'chirish", correct: false }, { text: "Hech narsa", correct: false } ] },
        ] },
    ]
  },
  {
    id: 'aia-3', phase: 0, topic: 2, title: "AI bilan rasm va dizayn yaratish (Canva, Gamma)", xp: 120,
    steps: [
      { type: 'video', title: "Video dars: Vizual Kontent va Dizayn",
        content: `AI bilan rasm, banner va prezentatsiya yaratishni o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Diffusion va Prompt Chaining",
        content: `**AI rasmni qanday chizadi?** Bu **diffusion** (tumandan ochish) usuli bilan bo'ladi. Tasavvur qiling: avval ekran to'la "qor" (telshovqin) bo'ladi. Keyin AI shu tumanni asta-sekin tozalab boradi — xuddi tumandan rasm chiqib kelgandek — va siz so'ragan rasmni "ochib" beradi.\n\n**Prompt chaining (buyruqlar zanjiri)** — bitta javobni keyingi buyruqqa ulash. Masalan:\n1. ChatGPT'dan logotip g'oyasini so'rang\n2. O'sha g'oyani rasm yaratuvchi AI'ga buyruq qilib bering\n3. Chiqqan rasmni Canva'da bannerga joylang\n\nHar bosqich keyingisini boyitadi — bu juda kuchli ishlash usuli.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vositalar:** Leonardo.ai / Ideogram (har kuni bepul limit bor), Gamma.app, Canva (Magic Studio).\n\n**Amaliyot:**\n- 🎤 **Gamma.app** — bitta g'oyani yozsangiz, 3 daqiqada tayyor taqdimot yoki sayt qoralamasini yig'ib beradi.\n- 🎨 **Canva + Leonardo.ai** — professional marketing banner yaratish.\n\n**Yaxshi rasm buyrug'i nimadan iborat?** Mavzu + uslub + yorug'lik + rang + sifat so'zlari. Masalan: "minimalist, studio yorug'ligi, ko'k ranglar, yuqori sifat". Buyruq qanchalik aniq bo'lsa — rasm shunchalik chiroyli chiqadi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Diffusion modeli rasmni qanday yasaydi?", options: [ { text: "Shovqindan qadama-qadam tozalab", correct: true }, { text: "Internetdan nusxalab", correct: false }, { text: "Qo'lda chizib", correct: false }, { text: "Bazadan olib", correct: false } ] },
          { question: "Prompt chaining nima?", options: [ { text: "Bitta prompt natijasini boshqasiga ulash", correct: true }, { text: "Promptni o'chirish", correct: false }, { text: "Internet zanjiri", correct: false }, { text: "Parol turi", correct: false } ] },
          { question: "Gamma.app nima qiladi?", options: [ { text: "Matndan prezentatsiya/sayt skeletini yasaydi", correct: true }, { text: "Video tahrirlaydi", correct: false }, { text: "Kod yozadi", correct: false }, { text: "Ovoz yozadi", correct: false } ] },
          { question: "Qaysi vosita rasm generatsiya qiladi?", options: [ { text: "Leonardo.ai", correct: true }, { text: "Excel", correct: false }, { text: "Telegram", correct: false }, { text: "Notepad", correct: false } ] },
          { question: "Yaxshi rasm prompti nimaga ega?", options: [ { text: "Mavzu, uslub, yorug'lik, rang detallari", correct: true }, { text: "Faqat bitta so'z", correct: false }, { text: "Hech qanday detal", correct: false }, { text: "Faqat raqamlar", correct: false } ] },
          { question: "Canva Magic Studio nimaga yordam beradi?", options: [ { text: "Dizayn va bannerlarni AI bilan yaratish", correct: true }, { text: "Kod kompilyatsiya qilish", correct: false }, { text: "Internet tezligini oshirish", correct: false }, { text: "Fayl siqish", correct: false } ] },
          { question: "Diffusion boshida tasvir qanday bo'ladi?", options: [ { text: "To'liq shovqin (tasodifiy nuqtalar)", correct: true }, { text: "Tayyor rasm", correct: false }, { text: "Bo'sh oq sahifa", correct: false }, { text: "Matn", correct: false } ] },
          { question: "Prompt chaining nega foydali?", options: [ { text: "Har bosqich keyingisini boyitadi", correct: true }, { text: "Internetni tezlashtiradi", correct: false }, { text: "Modelni o'chiradi", correct: false }, { text: "Foydasiz", correct: false } ] },
          { question: "Ideogram nima uchun mashhur?", options: [ { text: "Rasmda matn (text) yaxshi chiqaradi", correct: true }, { text: "Video montaj", correct: false }, { text: "Ovoz klonlash", correct: false }, { text: "Kod yozish", correct: false } ] },
          { question: "Marketing banner uchun nima kerak?", options: [ { text: "Aniq mavzu, brend rangi va chaqiruv matni", correct: true }, { text: "Hech narsa", correct: false }, { text: "Faqat oq fon", correct: false }, { text: "Tasodifiy ranglar", correct: false } ] },
        ] },
    ]
  },
  {
    id: 'aia-4', phase: 0, topic: 3, title: "AI bilan ovoz yaratish (ElevenLabs)", xp: 120,
    steps: [
      { type: 'video', title: "Video dars: Audio Generatsiya",
        content: `Matndan tabiiy ovoz yaratish va ovoz klonlashni o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: TTS arxitekturasi",
        content: `**TTS (matndan ovoz)** — yozgan matningizni tirik insondek tabiiy ovozda o'qib beradi. AI matnni o'qib, tovushga aylantiradi.\n\n**Asosiy sozlamalar:**\n- 🎚️ **Stability (barqarorlik)** — ovoz qanchalik bir tekis va tinch.\n- 🎭 **Hissiyot (style)** — ovozga his-tuyg'u qo'shish.\n- 🔊 **Similarity (o'xshashlik)** — nusxa ovoz asl ovozga qanchalik o'xshaydi.\n\n**Muhim:** bu sozlamalarni muvozanatlash kerak. Hissiyotni juda baland qilsangiz — sun'iy eshitiladi; juda past qilsangiz — quruq, jonsiz chiqadi.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vosita:** ElevenLabs (bepul versiyasi bor).\n\n**Klonlash (nusxa ovoz)** — bir ovozdan namuna berib, o'shanga o'xshash sun'iy ovoz yaratish.\n\n**Amaliyot:**\n- 🎙️ O'z ovozingizni yoki biror xarakter ovozini **klonlang**.\n- Sozlamalarni o'zgartirib, matndan **hissiyotga boy** podkast yoki reklama ovozini tayyorlang.\n\n**Maslahat:** matnga tinish belgilari va pauzalar qo'ying ("..., !") — shunda ovoz tabiiyroq jaranglaydi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "TTS nima qiladi?", options: [ { text: "Matnni ovozga aylantiradi", correct: true }, { text: "Ovozni matnga aylantiradi", correct: false }, { text: "Rasm yasaydi", correct: false }, { text: "Video montaj qiladi", correct: false } ] },
          { question: "ElevenLabs nima uchun ishlatiladi?", options: [ { text: "Ovoz generatsiya va klonlash", correct: true }, { text: "Kod yozish", correct: false }, { text: "Rasm chizish", correct: false }, { text: "Internet tezligi", correct: false } ] },
          { question: "\"Stability\" parametri nimani boshqaradi?", options: [ { text: "Ovozning barqarorligi/bir xilligi", correct: true }, { text: "Internet tezligini", correct: false }, { text: "Rang", correct: false }, { text: "Fayl hajmi", correct: false } ] },
          { question: "Ovoz klonlash nima?", options: [ { text: "Mavjud ovozga o'xshash sun'iy ovoz yaratish", correct: true }, { text: "Ovozni o'chirish", correct: false }, { text: "Videoni siqish", correct: false }, { text: "Parol yaratish", correct: false } ] },
          { question: "Juda yuqori hissiyot nimaga olib keladi?", options: [ { text: "Sun'iy/g'ayritabiiy eshitilishi mumkin", correct: true }, { text: "Doim yaxshiroq", correct: false }, { text: "Tezroq", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Ovozni tabiiyroq qilish uchun matnda nima yordam beradi?", options: [ { text: "Tinish belgilari va pauzalar", correct: true }, { text: "Faqat katta harflar", correct: false }, { text: "Raqamlar", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "TTS asosida nima yotadi?", options: [ { text: "Neyron tarmoq", correct: true }, { text: "Excel jadval", correct: false }, { text: "Qo'lda yozilgan qoidalar", correct: false }, { text: "Internet qidiruvi", correct: false } ] },
          { question: "ElevenLabs free tier nima beradi?", options: [ { text: "Cheklangan bepul foydalanish", correct: true }, { text: "Cheksiz hammasi tekin", correct: false }, { text: "Hech narsa", correct: false }, { text: "Faqat matn", correct: false } ] },
          { question: "Audio reklama uchun nima muhim?", options: [ { text: "Aniq matn + mos ohang/hissiyot", correct: true }, { text: "Faqat uzunlik", correct: false }, { text: "Faqat baland ovoz", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Similarity parametri nimaga ta'sir qiladi?", options: [ { text: "Klonlangan ovozga o'xshashlik darajasiga", correct: true }, { text: "Internet tezligiga", correct: false }, { text: "Rang", correct: false }, { text: "Fayl turi", correct: false } ] },
        ] },
    ]
  },
  {
    id: 'aia-5', phase: 0, topic: 4, title: "AI bilan video yaratish", xp: 130,
    steps: [
      { type: 'video', title: "Video dars: AI Video Pipeline",
        content: `Matndan video yaratish jarayonini o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Generativ video",
        content: `**AI video qanday yasaydi?** U videoni ketma-ket rasmlardan (kadrlardan) yig'adi va ular orasidagi **harakatni** mantiqan bog'laydi — shunda video silliq, uzluksiz ko'rinadi.\n\n**Motion control (harakatni boshqarish)** — kamera qaysi tomonga siljishini, obyekt qanday harakatlanishini siz belgilaysiz.\n\nHozircha AI videolar qisqa (bir necha soniya) bo'ladi va ba'zan g'alati joylar (artefakt) chiqadi — bu normal, bu texnologiya hali yangi.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vositalar:** Luma Dream Machine / Kling AI (bepul versiyasi bor).\n\n**Amaliyot — to'liq jarayon (pipeline):**\n\`G'oya → Ssenariy → Sahna → Video\`\n1. **G'oya** — nimani ko'rsatmoqchisiz (masalan reklama g'oyasi)\n2. **Ssenariy** — matn/ssenariy yozish (ChatGPT)\n3. **Sahna** — har sahna uchun rasm tayyorlash\n4. **Video** — Luma/Kling bilan jonlantirish\n\nOldingi darslarda yaratgan matn + rasm + ovozni birlashtirib, **15 soniyalik** jonli video-reklama yig'asiz.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Generativ video modeli nimani yaratadi?", options: [ { text: "Ketma-ket kadrlar va ular o'rtasidagi harakat", correct: true }, { text: "Faqat bitta rasm", correct: false }, { text: "Faqat matn", correct: false }, { text: "Ovoz", correct: false } ] },
          { question: "Motion control nima?", options: [ { text: "Harakat va kamerani boshqarish", correct: true }, { text: "Ovoz balandligi", correct: false }, { text: "Rang", correct: false }, { text: "Internet tezligi", correct: false } ] },
          { question: "Video yaratishning to'g'ri tartibi qaysi?", options: [ { text: "G'oya → Ssenariy → Sahna → Video", correct: true }, { text: "Video → G'oya → Ssenariy", correct: false }, { text: "Sahna → G'oya", correct: false }, { text: "Faqat Video", correct: false } ] },
          { question: "Qaysi vosita AI video yaratadi?", options: [ { text: "Luma Dream Machine", correct: true }, { text: "Excel", correct: false }, { text: "Notepad", correct: false }, { text: "Telegram", correct: false } ] },
          { question: "Hozirgi AI videolar qanday?", options: [ { text: "Qisqa va ba'zan artefaktli", correct: true }, { text: "Soatlab va mukammal", correct: false }, { text: "Faqat oq-qora", correct: false }, { text: "Ovozsiz bo'lishi mumkin emas", correct: false } ] },
          { question: "Script bosqichida nima qilinadi?", options: [ { text: "Ssenariy/matn yoziladi", correct: true }, { text: "Video eksport qilinadi", correct: false }, { text: "Domen sotib olinadi", correct: false }, { text: "Bot yoziladi", correct: false } ] },
          { question: "Scene bosqichi nima?", options: [ { text: "Har sahna uchun rasm/prompt tayyorlash", correct: true }, { text: "Kodni deploy qilish", correct: false }, { text: "Ovoz klonlash", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Reklama videosi qancha bo'lishi mumkin (amaliyotda)?", options: [ { text: "~15 soniya dinamik", correct: true }, { text: "2 soat", correct: false }, { text: "Faqat 1 kadr", correct: false }, { text: "Cheksiz", correct: false } ] },
          { question: "Pipeline'da oldingi darslar fayllari nega kerak?", options: [ { text: "Matn+rasm+audio birlashtiriladi", correct: true }, { text: "Kerak emas", correct: false }, { text: "Faqat o'chirish uchun", correct: false }, { text: "Internet uchun", correct: false } ] },
          { question: "Kling AI nima?", options: [ { text: "AI video generatsiya vositasi", correct: true }, { text: "Brauzer", correct: false }, { text: "Ovoz dasturi", correct: false }, { text: "Antivirus", correct: false } ] },
        ] },
    ]
  },
  {
    id: 'aia-6', phase: 0, topic: 5, title: "Muammoni AI yechimiga aylantirish", xp: 130,
    steps: [
      { type: 'video', title: "Video dars: Design Thinking",
        content: `Real muammoni AI yechimiga aylantirishni o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Muammodan yechimga",
        content: `**Design Thinking (dizayn tafakkuri)** — texnologiyadan emas, **odamning muammosidan** boshlash usuli. Ko'pchilik xato qiladi: avval "AI bilan nima qilsam?" deydi. To'g'risi esa: avval "Odamlar nimadan qiynaladi?" deb so'rash.\n\n**Muammodan yechimga 3 qadam:**\n1. 😣 **Odamning og'rig'i** — mijozlar nimadan aziyat chekadi?\n2. 🎯 Shu muammoni AI qanday yengillashtira oladi?\n3. 💡 Buni AI funksiyasiga aylantirish.\n\n**Misol:** "Yetkazib berish kechikadi" (muammo) → "AI mijozga buyurtma holatini avtomatik aytib turadi" (yechim).\n\n**Asosiy qoida:** avval muammoni chuqur tushuning, keyingina yechim quring.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vosita:** Claude (Artifacts funksiyasi).\n\n**Artifacts** — Claude javobini alohida tirik oynada (ishlaydigan tugmalar, dizayn, hujjat) ko'rsatadi. Ya'ni kod yozmasdan turib, ishlaydigan namuna (prototip) yaratasiz.\n\n**Amaliyot:**\n- Real biznes muammosini (masalan yetkazib berish xizmati) Claude bilan tahlil qiling.\n- Artifacts yordamida AI yechimining **ishlaydigan namunasini (UI mockup — interfeys qoralamasi)** ko'z oldingizga keltiring — dasturchisiz!` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Design Thinking nimadan boshlanadi?", options: [ { text: "Muammodan (user pains)", correct: true }, { text: "Texnologiyadan", correct: false }, { text: "Puldan", correct: false }, { text: "Kafedan", correct: false } ] },
          { question: "\"User pains\" nima?", options: [ { text: "Foydalanuvchi og'riqlari/muammolari", correct: true }, { text: "Dastur xatosi", correct: false }, { text: "Internet uzilishi", correct: false }, { text: "Parol", correct: false } ] },
          { question: "Claude Artifacts nima qiladi?", options: [ { text: "Javobni interaktiv oynada (UI/kod) ko'rsatadi", correct: true }, { text: "Video montaj qiladi", correct: false }, { text: "Ovoz klonlaydi", correct: false }, { text: "Internet tezligini oshiradi", correct: false } ] },
          { question: "Problem-Solution Mapping nima?", options: [ { text: "Muammoni yechimga bog'lash", correct: true }, { text: "Xaritada manzil topish", correct: false }, { text: "Fayl saqlash", correct: false }, { text: "Parol yaratish", correct: false } ] },
          { question: "To'g'ri tartib qaysi?", options: [ { text: "Avval muammoni tushun, keyin yechim qur", correct: true }, { text: "Avval yechim, keyin muammo", correct: false }, { text: "Faqat texnologiya", correct: false }, { text: "Tartib muhim emas", correct: false } ] },
          { question: "UI mockup nima?", options: [ { text: "Interfeysning ko'rgazmali prototipi", correct: true }, { text: "Tayyor dastur", correct: false }, { text: "Ma'lumotlar bazasi", correct: false }, { text: "Video", correct: false } ] },
          { question: "Artifacts bilan prototip qilish uchun dasturchi shartmi?", options: [ { text: "Yo'q, kod yozmasdan ham mumkin", correct: true }, { text: "Ha, albatta shart", correct: false }, { text: "Faqat dizayner kerak", correct: false }, { text: "Avtomatik", correct: false } ] },
          { question: "\"Yetkazib berish kechikadi\" — bu nima?", options: [ { text: "User pain (muammo)", correct: true }, { text: "Yechim", correct: false }, { text: "Texnologiya", correct: false }, { text: "Tool", correct: false } ] },
          { question: "AI yechimni qaerdan olib chiqamiz?", options: [ { text: "Muammoni AI funksiyasiga o'tkazib", correct: true }, { text: "Tasodifan", correct: false }, { text: "Faqat kodlash bilan", correct: false }, { text: "Internetdan", correct: false } ] },
          { question: "Design Thinking nimaga e'tibor beradi?", options: [ { text: "Foydalanuvchi ehtiyojiga", correct: true }, { text: "Faqat foydaga", correct: false }, { text: "Faqat dizaynga", correct: false }, { text: "Hech narsaga", correct: false } ] },
        ] },
    ]
  },
  {
    id: 'aia-7', phase: 0, topic: 6, title: "AI ga o'z hujjatlaringizni o'rgatish (NotebookLM)", xp: 140,
    steps: [
      { type: 'video', title: "Video dars: Bilimlar Bazasi va RAG",
        content: `Modelga o'z hujjatlaringizni "o'rgatishni" — RAG asosini o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: RAG mantiqi",
        content: `**RAG (AI ga o'z hujjatingni o'rgatish)** — AI'ga o'zining bilmagan, **yangi** ma'lumotni berish usuli.\n\n**Muammo:** AI faqat o'qitilgan vaqtigacha biladi. U sizning do'koningiz narxini, biznes qoidalaringizni bilmaydi.\n\n**RAG qanday hal qiladi:**\n1. 📄 Hujjatlaringizni bo'laklarga ajratadi\n2. ❓ Savol kelganda — eng mos bo'lakni topadi\n3. 🤖 O'sha bo'lakni AI'ga "mana, shunga qarab javob ber" deb beradi\n4. ✅ AI **faqat shu ma'lumotdan** javob beradi → xato to'qish (gallyutsinatsiya) kamayadi.\n\nDemak AI sizning biznesingizni tashqaridan berilgan hujjat orqali "taniydi".\n\n💡 **Hayotiy misol:** Do'koningiz narx-ro'yxatini AI'ga bersangiz, u mijozlarga "bu mahsulot qancha?" degan savollarga o'zi, aniq narx bilan javob beradi — siz har safar yozib o'tirmaysiz.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vosita:** Google NotebookLM (mutlaqo bepul).\n\n**Amaliyot:**\n- NotebookLM ichiga biznes qoidalari, kitoblar yoki PDF hujjatlarni yuklang.\n- Shular asosida **faqat siz bergan hujjatlardan** gapiradigan AI "o'quv yordamchisi" yarating.\n\nNotebookLM har javobda **manbani** ko'rsatadi — ya'ni javob qaysi hujjatdan olinganini bilib turasiz. Bu ishonchni oshiradi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "RAG nima beradi?", options: [ { text: "Modelga tashqi/yangi bilimni qo'shadi", correct: true }, { text: "Modelni tezlashtiradi", correct: false }, { text: "Ovoz yaratadi", correct: false }, { text: "Rasm chizadi", correct: false } ] },
          { question: "RAG gallyutsinatsiyaga qanday ta'sir qiladi?", options: [ { text: "Kamaytiradi (faqat bazadan javob)", correct: true }, { text: "Oshiradi", correct: false }, { text: "Ta'sir qilmaydi", correct: false }, { text: "Modelni o'chiradi", correct: false } ] },
          { question: "NotebookLM narxi qancha?", options: [ { text: "Bepul", correct: true }, { text: "$100", correct: false }, { text: "$10/oy", correct: false }, { text: "Faqat korxonalarga", correct: false } ] },
          { question: "RAG'da \"Retrieval\" qadami nima?", options: [ { text: "Savolga mos hujjat bo'lagini topish", correct: true }, { text: "Modelni o'qitish", correct: false }, { text: "Tarjima qilish", correct: false }, { text: "Rasm yasash", correct: false } ] },
          { question: "Nega LLM shaxsiy hujjatlaringizni bilmaydi?", options: [ { text: "U faqat o'qitilgan ma'lumotni biladi", correct: true }, { text: "U dangasa", correct: false }, { text: "Internet yo'q", correct: false }, { text: "U hammasini biladi", correct: false } ] },
          { question: "NotebookLM'ga nima yuklash mumkin?", options: [ { text: "PDF, hujjat, kitoblar", correct: true }, { text: "Faqat rasm", correct: false }, { text: "Faqat video", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Topilgan bo'lak modelga nima sifatida beriladi?", options: [ { text: "Kontekst", correct: true }, { text: "Parol", correct: false }, { text: "Token narxi", correct: false }, { text: "Rang", correct: false } ] },
          { question: "NotebookLM ishonch uchun nima ko'rsatadi?", options: [ { text: "Javob qaysi manbadan olinganini", correct: true }, { text: "Reklama", correct: false }, { text: "Internet tezligini", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "\"O'quv asistenti\" qaysi asosida gapiradi?", options: [ { text: "Faqat yuklangan baza asosida", correct: true }, { text: "Butun internet", correct: false }, { text: "Tasodifan", correct: false }, { text: "Foydalanuvchi xohishi", correct: false } ] },
          { question: "RAG'ning birinchi qadami nima?", options: [ { text: "Hujjatlarni bo'laklarga ajratish", correct: true }, { text: "Modelni o'chirish", correct: false }, { text: "Domen olish", correct: false }, { text: "Video yasash", correct: false } ] },
        ] },
    ]
  },

  // ═══ 1-MODUL YAKUNIY IMTIHONI ════════════════════════════════════════
  {
    id: 'aia-8e', phase: 0, topic: 7, title: "1-bosqich: Yakuniy imtihon", xp: 250,
    steps: [
      { type: 'info', title: "1-bosqich: Darslar xulosasi",
        content: `Bu imtihon **1–7-darslar** (1-bosqich: AI vositalari bilan ijod) bo'yicha. Har darsning asosiy fikrini eslab oling:\n\n---\n\n**📘 1-dars: Buyruq (prompt) asoslari**\nPrompt — AI'ga beriladigan matnli ko'rsatma. **Temperature (ijodiylik):** 0 = aniq/qat'iy javob, 1 = ijodiy/xilma-xil javob. **Zero-shot** = misolsiz to'g'ridan-to'g'ri so'rash. **Few-shot** = 1–2 ta misol ko'rsatib so'rash.\n\n**📘 2-dars: AI qanday "o'ylaydi"**\n**Gallyutsinatsiya (xato to'qish)** — AI ishonch bilan noto'g'ri ma'lumot aytishi. **Token** — so'z bo'lagi (taxminan 3–4 harf). **Kontekst oynasi** — AI bir safar qabul qila oladigan eng ko'p token miqdori. **Embedding** — matnni raqamlarga (vektorga) aylantirish.\n\n**📘 3-dars: Rasm va dizayn (Canva, Gamma)**\n**Canva** — poster, logotip, SMM kontent, taqdimot. **Gamma** — taqdimot va saytlarni AI bilan avtomatik yasash. **DALL-E / Midjourney** — matndan rasm.\n\n**📘 4-dars: Ovoz (ElevenLabs)**\n**ElevenLabs** — matndan ovoz (TTS) va **ovoz klonlash**. Tabiiy, his-tuyg'uli ovoz yaratadi.\n\n**📘 5-dars: AI video**\nVideo tartibi: **ssenariy → ovoz → video**. Qisqa, aniq ssenariy yaxshiroq natija beradi.\n\n**📘 6-dars: Muammodan yechimga (Design Thinking)**\nKlassik 5 bosqich (tartibi muhim!): **Empathy** (odamni tushunish) → **Define** (muammoni aniqlash) → **Ideate** (g'oyalar) → **Prototype** (namuna) → **Test** (sinov).\n\n**📘 7-dars: NotebookLM va RAG**\nRAG tartibi: hujjat → bo'laklarga bo'lish → savolga mos bo'lakni topish → AI'ga kontekst sifatida berish → javob. NotebookLM faqat siz yuklagan hujjatlardan javob beradi (internetdan emas).` },
      { type: 'info', title: "Imtihon Strategiyasi va Maslahatlar",
        content: `**Imtihonga tayyorlanish:**\n\n✅ **Belgilash savollar (15 ta × 1 ball):** To'rtta variant ichida faqat 1 tasi to'g'ri. Har mavzudan 2–3 ta savol bor.\n\n✅ **Yozma savollar (5 ta × 2 ball):** Kalit so'zlardan 1–2 tasini ishlating. Uzun yozish shart emas — aniq va lo'nda javob yetarli.\n\n⏱ **Vaqt:** Taxminan 20 daqiqa. Shoshilmang, barcha savolga javob bering.\n\n---\n\n**❗ Eng ko'p uchraydigan xatolar:**\n\n- "Temperature = kompyuter harorati" → **XATO!** Bu — javob ijodiylik darajasi (0–1)\n- "Gallyutsinatsiya = AI chalkashib ketishi" → **XATO!** Bu — AI noto'g'ri ma'lumot ixtiro qilishi\n- "RAG = faqat internet qidirish" → **XATO!** Bu — hujjat + qidirish + kontekst zanjiri\n- "Design Thinking birinchi qadami = Prototype" → **XATO!** Birinchisi — Empathy\n\n---\n\n**O'tish uchun:** 25 balldan **18 ball** (70%) yig'ing. Avval amaliy vazifani bajaring, so'ng imtihonga kiring.` },
      { type: 'finalquiz', title: "Yakuniy imtihon (1-bosqich)",
        content: `20 ta savol: 15 ta belgilash (1 balldan) + 5 ta yozma (2 balldan). Jami 25 ball, o'tish uchun **18 ball** kerak.`,
        questions: [
          { question: "Prompt nima?", lesson: "1-dars", options: [ { text: "AI modeliga beriladigan matnli ko'rsatma", correct: true }, { text: "Kompyuter kodi", correct: false }, { text: "Ovoz fayli", correct: false }, { text: "Rasm formati", correct: false } ] },
          { question: "Temperature=0 va Temperature=1 farqi nima?", lesson: "1-dars", options: [ { text: "0=aniq/faktik javob, 1=ijodiy/xilma-xil javob", correct: true }, { text: "0=tez, 1=sekin", correct: false }, { text: "0=o'zbek tili, 1=ingliz tili", correct: false }, { text: "Farqi yo'q", correct: false } ] },
          { question: "Gallyutsinatsiya nima?", lesson: "2-dars", options: [ { text: "AI noto'g'ri ma'lumot ixtiro qilishi", correct: true }, { text: "AI rasmlar chizishi", correct: false }, { text: "Internet uzilishi", correct: false }, { text: "Model yangilanishi", correct: false } ] },
          { question: "Kontekst oynasi (context window) nima?", lesson: "2-dars", options: [ { text: "Model bir vaqtda qabul qila oladigan maksimal token miqdori", correct: true }, { text: "Brauzer oynasi o'lchami", correct: false }, { text: "Rasm o'lchami", correct: false }, { text: "Internet tezligi", correct: false } ] },
          { question: "Canva AI nima uchun ishlatiladi?", lesson: "3-dars", options: [ { text: "Vizual kontent va dizayn yaratish", correct: true }, { text: "Faqat ovoz yozish", correct: false }, { text: "Kod yozish", correct: false }, { text: "Video o'chirish", correct: false } ] },
          { question: "Gamma AI nima yaratadi?", lesson: "3-dars", options: [ { text: "Taqdimot (prezentatsiya) va veb-sahifalar", correct: true }, { text: "Faqat audio", correct: false }, { text: "Faqat rasm", correct: false }, { text: "Dastur kodi", correct: false } ] },
          { question: "ElevenLabs asosan nima qiladi?", lesson: "4-dars", options: [ { text: "Matnni ovozga aylantiradi (TTS) va ovoz klonlaydi", correct: true }, { text: "Rasm chizadi", correct: false }, { text: "Video montaj", correct: false }, { text: "Tarjima qiladi", correct: false } ] },
          { question: "AI video yaratishda qaysi format yaxshiroq natija beradi?", lesson: "5-dars", options: [ { text: "Qisqa, aniq stsenariy", correct: true }, { text: "Uzun, noaniq tavsif", correct: false }, { text: "Faqat rasm yuborish", correct: false }, { text: "Format muhim emas", correct: false } ] },
          { question: "Design Thinking jarayonida birinchi qadam nima?", lesson: "6-dars", options: [ { text: "Empathy — foydalanuvchini tushunish", correct: true }, { text: "Prototype — namuna qurish", correct: false }, { text: "Test — sinov qilish", correct: false }, { text: "Define — muammo aniqlash", correct: false } ] },
          { question: "Design Thinking'da to'g'ri tartib qaysi?", lesson: "6-dars", options: [ { text: "Empathy → Define → Ideate → Prototype → Test", correct: true }, { text: "Ideate → Prototype → Test → Empathy → Define", correct: false }, { text: "Define → Empathy → Test → Ideate → Prototype", correct: false }, { text: "Test → Define → Empathy → Ideate → Prototype", correct: false } ] },
          { question: "RAG nima uchun kerak?", lesson: "7-dars", options: [ { text: "Modelga yangi/shaxsiy bilimni berish uchun", correct: true }, { text: "Modelni o'chirish uchun", correct: false }, { text: "Internet tezligini oshirish", correct: false }, { text: "Rasm yaratish", correct: false } ] },
          { question: "NotebookLM qanday ishlaydi?", lesson: "7-dars", options: [ { text: "Faqat siz yuklagan hujjatlar asosida savolga javob beradi", correct: true }, { text: "Butun internetdan qidiradi", correct: false }, { text: "Faqat rasm tahlil qiladi", correct: false }, { text: "Faqat tarjima qiladi", correct: false } ] },
          { question: "Zero-shot prompting nima?", lesson: "1-dars", options: [ { text: "Misol ko'rsatmasdan to'g'ridan to'g'ri so'rash", correct: true }, { text: "Nol token bilan ishlash", correct: false }, { text: "Modelni o'qitish", correct: false }, { text: "Video yaratish", correct: false } ] },
          { question: "Few-shot prompting nima?", lesson: "1-dars", options: [ { text: "Modelga bir nechta misol ko'rsatib so'rash", correct: true }, { text: "Kam token sarflash", correct: false }, { text: "Faqat rasmlar bilan ishlash", correct: false }, { text: "Modelni o'chirish", correct: false } ] },
          { question: "1-bosqichning asosiy maqsadi nima?", lesson: "1-bosqich", options: [ { text: "Kod yozmasdan AI vositalarini amalda qo'llash", correct: true }, { text: "Murakkab matematik hisoblash", correct: false }, { text: "Faqat rasm chizish", correct: false }, { text: "Serverlarni boshqarish", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', lesson: "1-dars", question: "Prompt yozishda qanday qoidaga amal qilish kerak? (1-2 ta qoida yozing)", keywords: ["aniq", "kontekst", "rol", "misal", "tushunt", "format", "qisqa", "clear"], modelAnswer: "Aniq va kontekstli bo'lsin; modelga rol bering ('Sen ekspertsan...'); misollar keltiring; natija formatini ko'rsating." },
          { type: 'text', lesson: "4-dars", question: "ElevenLabs va oddiy matn-ovoz (TTS) dasturlarining farqi nima?", keywords: ["tabiiy", "ovoz klonlash", "his", "emotion", "real", "insoniy", "natural", "clone"], modelAnswer: "ElevenLabs ovoz klonlash imkonini beradi va juda tabiiy, his-tuyg'uli ovoz yaratadi; oddiy TTS esa sun'iy va bir xil ohangda gapiradi." },
          { type: 'text', lesson: "6-dars", question: "Design Thinking nima va u nima uchun kerak?", keywords: ["foydalanuvchi", "muammo", "yechim", "ijodiy", "inovatsiya", "insoniy", "user"], modelAnswer: "Design Thinking — foydalanuvchi muammosidan kelib chiqib ijodiy yechim topish metodologiyasi. Mahsulot yaratishda insoniy ehtiyojlarni markazga qo'yadi." },
          { type: 'text', lesson: "7-dars", question: "RAG (Retrieval-Augmented Generation) qanday ishlaydi? Jarayonni tushuntirib bering.", keywords: ["hujjat", "qidirish", "kontekst", "model", "javob", "chunk", "baza", "embedding", "bo'lak"], modelAnswer: "Hujjat bo'laklarga bo'linadi → savol kelganda eng mos bo'lak qidiriladi → u kontekst sifatida modelga beriladi → model faqat shu ma'lumot asosida javob beradi." },
          { type: 'text', lesson: "1-bosqich", question: "1-bosqich davomida o'rgangan bitta AI vositasini va undan qanday foydalanishni yozing.", keywords: ["canva", "gamma", "elevenlabs", "video", "notebooklm", "gemini", "rasm", "ovoz", "taqdimot", "dizayn"], modelAnswer: "Masalan: Canva — logotip, poster va SMM kontenti yaratish uchun; ElevenLabs — biznes uchun ovozli reklama yozish uchun." },
        ] },
    ]
  },

  // ═══ 2-MODUL: VIBE CODING VA REAL LOYIHALAR (Engineering) ════════════
  {
    id: 'aia-8', phase: 1, topic: 0, title: "Kod yozmasdan sayt yasash (Vibe coding)", xp: 150,
    steps: [
      { type: 'video', title: "Video dars: Vibe Coding",
        content: `Endi pleygraundlardan chiqib, AI bilan kod yozishni boshlaymiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Vibe Coding falsafasi",
        content: `**Bu darsda nimani o'rganamiz?**\n- Kod yozishni bilmasdan turib, AI yordamida tayyor sayt yasashni.\n- Saytning ikki qismi — ko'rinadigan va ko'rinmas qism — nima ekanini.\n- Nega bu ko'nikma biznes yoki shaxsiy loyiha uchun foydali ekanini.\n\n**Vibe coding nima?**\nVibe coding — oddiy gaplar bilan dastur yasash. Siz shunchaki "menga nima kerakligini" aytasiz, AI esa kodni o'zi yozib beradi. Dasturlash tilini yodlash shart emas — faqat mantiqni (nima qanday ishlashini) tushunsangiz kifoya.\n\n💡 O'xshatish: bu — usta bilan ishlagandek. Siz "shu yerga eshik qo'y" deysiz, usta uni o'zi yasaydi. G'isht terishni bilishingiz shart emas.\n\n**Har bir saytning 2 qismi bor:**\n- 🎨 **Frontend** (ko'rinadigan qism) — foydalanuvchi ko'zi bilan ko'radigan hamma narsa: tugmalar, matn, rasm, ranglar. Do'konning vitrinasi kabi.\n- ⚙️ **Backend** (ko'rinmas qism) — orqada ishlaydigan mantiq: ma'lumot saqlash, hisob-kitob, server. Do'konning ombori kabi — mijoz ko'rmaydi, lekin hammasi shunga bog'liq.\n\nBu darsda biz **Frontend** — ya'ni saytning tashqi ko'rinishini (landing page — tanishtiruv sahifasi) yasaymiz.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Qaysi vositalardan foydalanamiz?**\n- Cursor yoki Windsurf — ichiga AI o'rnatilgan kod muharriri (IDE — dasturchilar kod yozadigan maxsus dastur).\n- Google AI Studio — brauzerda ishlaydigan bepul AI maydoni.\n\nCursor'da siz oddiy buyruq yozasiz ("telefon va kompyuterga mos landing page yasab ber"), u esa kodni o'zi yozadi va nima qilganini tushuntiradi.\n\n**Amaliyot:**\n- Cursor + AI bilan responsiv sayt yasaymiz. Responsiv — telefon, planshet va kompyuter, hammasiga moslashadigan degani.\n- "Yana ko'kroq qil", "tugmani kattaroq qil" kabi oddiy gaplar bilan tahrirlash.\n\n💡 Sahifaning eng tepasidagi, birinchi ko'zga tashlanadigan katta e'lon qismi **Hero sektsiya** deyiladi — odatda sarlavha, qisqa izoh va bitta tugmadan iborat.` },
      { type: 'info', title: "Eslab qoling",
        content: `**Eslab qoling**\n- Vibe coding — kod yozmasdan, oddiy gaplar bilan AI'ga sayt yasattirish.\n- Frontend — ko'rinadigan qism (vitrina), Backend — ko'rinmas qism (ombor).\n- Cursor/Windsurf — ichida AI bo'lgan kod muharrirlari; siz buyruq berasiz, ular kod yozadi.\n- Responsiv sayt har qanday qurilmada (telefon, kompyuter) chiroyli ko'rinadi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `20 ta savol: 15 ta belgilash (1 balldan) + 5 ta yozma (2 balldan). Jami 25 ball, o'tish uchun **18 ball** kerak.`,
        questions: [
          { question: "Vibe coding nima?", options: [ { text: "Tabiiy til buyruqlari bilan dastur qurish", correct: true }, { text: "Faqat qo'lda kod yozish", correct: false }, { text: "Video montaj", correct: false }, { text: "Ovoz yozish", correct: false } ] },
          { question: "Frontend nima?", options: [ { text: "Foydalanuvchi ko'radigan qism (UI)", correct: true }, { text: "Server mantiqi", correct: false }, { text: "Ma'lumotlar bazasi", correct: false }, { text: "Internet kabeli", correct: false } ] },
          { question: "Backend nima?", options: [ { text: "Ko'rinmas mantiq va server qismi", correct: true }, { text: "Tugmalar va ranglar", correct: false }, { text: "Logotip", correct: false }, { text: "Video", correct: false } ] },
          { question: "Cursor nima?", options: [ { text: "AI o'rnatilgan kod muharriri", correct: true }, { text: "Brauzer", correct: false }, { text: "Antivirus", correct: false }, { text: "Ovoz dasturi", correct: false } ] },
          { question: "\"Responsiv\" sayt nima?", options: [ { text: "Telefon va kompyuterga moslashadigan", correct: true }, { text: "Tez ochiladigan", correct: false }, { text: "Faqat oq rangli", correct: false }, { text: "Ovozli", correct: false } ] },
          { question: "Vibe coding'da nimani tushunish muhim?", options: [ { text: "Mantiqni (sintaksis emas)", correct: true }, { text: "Faqat ranglarni", correct: false }, { text: "Hech narsani", correct: false }, { text: "Faqat internetni", correct: false } ] },
          { question: "Landing page bu qaysi qism?", options: [ { text: "Frontend (UI)", correct: true }, { text: "Backend", correct: false }, { text: "Ma'lumotlar bazasi", correct: false }, { text: "Server", correct: false } ] },
          { question: "Cursor'da tahrirlash qanday?", options: [ { text: "Tabiiy til buyruqlari bilan", correct: true }, { text: "Faqat sichqoncha bilan", correct: false }, { text: "Imkonsiz", correct: false }, { text: "Faqat ovoz bilan", correct: false } ] },
          { question: "Windsurf nima?", options: [ { text: "AI yordamli kod muharriri (IDE)", correct: true }, { text: "O'yin", correct: false }, { text: "Brauzer", correct: false }, { text: "Ovoz dasturi", correct: false } ] },
          { question: "Vibe coding'da AI nima qiladi?", options: [ { text: "Kodni yozadi va tushuntiradi", correct: true }, { text: "Faqat kuzatadi", correct: false }, { text: "Hech narsa", correct: false }, { text: "Internetni o'chiradi", correct: false } ] },
          { question: "Landing page qanday maqsadda ishlatiladi?", options: [ { text: "Mahsulot yoki xizmatni tanishtirish, mijozni jalb qilish", correct: true }, { text: "Server sozlamalari", correct: false }, { text: "Video saqlash", correct: false }, { text: "Parol boshqarish", correct: false } ] },
          { question: "UI dizaynda \"Hero sektsiya\" nima?", options: [ { text: "Sahifaning asosiy e'lon qismi (birinchi ko'rinadigan)", correct: true }, { text: "Pastki qism", correct: false }, { text: "Menyu", correct: false }, { text: "Hisob ma'lumotlari", correct: false } ] },
          { question: "Cursor'da buyruq (prompt) qanday yoziladi?", options: [ { text: "Tabiiy tilda — nima kerakligini aytasiz", correct: true }, { text: "Faqat Python kodida", correct: false }, { text: "Faqat inglizcha", correct: false }, { text: "Maxsus til kerak", correct: false } ] },
          { question: "Vibe coding'da qaysi tillar bilish shart?", options: [ { text: "Hech qaysi — AI kod yozadi", correct: true }, { text: "Faqat Python", correct: false }, { text: "HTML va CSS", correct: false }, { text: "Java", correct: false } ] },
          { question: "Saytning dastlabki ko'rinishini tekshirish uchun nima ishlatiladi?", options: [ { text: "Brauzer (lokal preview)", correct: true }, { text: "Telegram", correct: false }, { text: "Excel", correct: false }, { text: "Photoshop", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', question: "Vibe coding'ning an'anaviy dasturlashdan asosiy farqi nimada?", keywords: ["tabiiy til", "kod yozmasdan", "ai", "buyruq", "mantiq", "sintaksis"], modelAnswer: "Vibe coding'da sintaksis o'rganish shart emas — siz tabiiy tilda nima kerakligini aytasiz, AI kodni yozadi. Faqat mantiqni tushunish kerak." },
          { type: 'text', question: "Frontend va Backend nima? Ikkitasini qisqacha izohlang.", keywords: ["frontend", "ko'rinadigan", "ui", "backend", "server", "mantiq", "ko'rinmas"], modelAnswer: "Frontend — foydalanuvchi ko'radigan qism (tugmalar, dizayn, matn). Backend — ko'rinmas server qismi (ma'lumot saqlash, hisob-kitob, logika)." },
          { type: 'text', question: "Cursor IDE'ning asosiy afzalligi nima?", keywords: ["ai", "avtomatik", "kod", "taklif", "tushunt", "generatsiya", "buyruq"], modelAnswer: "Cursor'da AI o'rnatilgan bo'lib, tabiiy til buyruqlari orqali kod yozib, tushuntirib, xatolarni tuzatib beradi." },
          { type: 'text', question: "Responsiv sayt yaratish nega muhim?", keywords: ["telefon", "mobil", "plansh", "har xil", "o'lcham", "screen", "qurilma"], modelAnswer: "Hozir foydalanuvchilarning ko'pchiligi telefondan kiradi. Responsiv sayt har qanday qurilmada (telefon, planshet, kompyuter) to'g'ri ko'rinadi." },
          { type: 'text', question: "Vibe coding bilan biror mahsulot yasamoqchi bo'lsangiz, qayerdan boshlaysiz?", keywords: ["g'oya", "reja", "cursor", "prompt", "loyiha", "tavsif", "maqsad", "nima kerak"], modelAnswer: "Avval mahsulot maqsadini aniqlayman, so'ng Cursor yoki Windsurf'da tabiiy tilda nima kerakligini tavsiflab, AI kod generatsiya qilishini kutaman." },
        ] },
    ]
  },
  {
    id: 'aia-9', phase: 1, topic: 1, title: "Saytni internetga chiqarish (deploy va domen)", xp: 150,
    steps: [
      { type: 'video', title: "Video dars: GitHub va Deploy",
        content: `Saytni internetga chiqarishni o'rganamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Version Control va Deploy",
        content: `**Bu darsda nimani o'rganamiz?**\n- Tayyor saytni internetga chiqarib, dunyoning istalgan joyidan ochiladigan qilishni.\n- Git, hosting, domen kabi asosiy tushunchalarni — sodda tilda.\n\nSaytingiz tayyor bo'ldi — endi uni boshqalar ham ko'rishi uchun internetga chiqarish kerak. Buning uchun bir nechta tushuncha bor:\n\n- 🗂️ **Version control (Git)** (o'zgarishlarni saqlab boruvchi tizim) — kodning har bir holatini eslab qoladi. Xato qilsangiz orqaga qaytish va jamoa bilan ishlash uchun kerak. O'yindagi "saqlash nuqtasi" kabi.\n- 🌐 **Hosting** (sayt yashaydigan joy) — sayt fayllari turadigan server, ya'ni doim yoqilgan kompyuter. Saytning "uyi" kabi.\n- 🚀 **Deploy** (internetga chiqarish) — saytni serverga joylab, jonli qilish.\n- 🔗 **Domen** (saytning manzili) — masalan saytim.uz. Uyning ko'cha manzili kabi.\n- 🔁 **CI/CD** (avtomatik chiqarish) — siz kodni yangilashingiz bilan, tizim uni o'zi tekshirib internetga chiqaradi. Konveyer lenta kabi — qo'lda hech narsa qilmaysiz.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vositalar:** GitHub (kod saqlash joyi), Git Bash, Vercel / Netlify (bepul hosting).\n\n**Amaliyot:**\n1. 8-darsdagi sayt kodini terminal orqali GitHub'ga yuklang (har bir satr — bitta buyruq):\n\`\`\`\ngit init          # loyihani Git'ga ulash\ngit add .         # barcha fayllarni tanlash\ngit commit -m "Birinchi versiya"   # versiyani saqlash\ngit push          # GitHub'ga yuborish\n\`\`\`\n2. GitHub'ni **Vercel**'ga ulab, saytni internetga chiqaring.\n\nTabriklaymiz — endi saytingiz dunyoning istalgan joyidan ochiladi!` },
      { type: 'info', title: "Eslab qoling",
        content: `**Eslab qoling**\n- Git — kod o'zgarishlarini saqlab boruvchi tizim; xatoda orqaga qaytish imkonini beradi.\n- Hosting — sayt yashaydigan server; Deploy — saytni o'sha serverga chiqarib jonli qilish.\n- Domen — saytning manzili (masalan saytim.uz).\n- GitHub'ni Vercel'ga ulasangiz, sayt avtomatik internetga chiqadi va 24/7 ishlaydi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Git nima uchun kerak?", options: [ { text: "Kod versiyalarini saqlash va kuzatish", correct: true }, { text: "Rasm chizish", correct: false }, { text: "Video montaj", correct: false }, { text: "Ovoz yozish", correct: false } ] },
          { question: "Deploy nima?", options: [ { text: "Kodni serverga chiqarish (jonli qilish)", correct: true }, { text: "Kodni o'chirish", correct: false }, { text: "Rasm yuklash", correct: false }, { text: "Parol yaratish", correct: false } ] },
          { question: "Domen nima?", options: [ { text: "Saytning manzili (masalan saytim.uz)", correct: true }, { text: "Server xonasi", correct: false }, { text: "Kod muharriri", correct: false }, { text: "Brauzer", correct: false } ] },
          { question: "Hosting nima?", options: [ { text: "Sayt fayllari saqlanadigan server", correct: true }, { text: "Domen narxi", correct: false }, { text: "Internet tezligi", correct: false }, { text: "Logotip", correct: false } ] },
          { question: "Qaysi bepul hosting?", options: [ { text: "Vercel / Netlify", correct: true }, { text: "Photoshop", correct: false }, { text: "Excel", correct: false }, { text: "Telegram", correct: false } ] },
          { question: "\"git push\" nima qiladi?", options: [ { text: "Kodni GitHub'ga yuboradi", correct: true }, { text: "Kodni o'chiradi", correct: false }, { text: "Sayt yopadi", correct: false }, { text: "Domen sotib oladi", correct: false } ] },
          { question: "CI/CD nima?", options: [ { text: "Avtomatik test va deploy jarayoni", correct: true }, { text: "Ovoz formati", correct: false }, { text: "Rasm filtri", correct: false }, { text: "Parol turi", correct: false } ] },
          { question: "Version control nega foydali?", options: [ { text: "Xatoda orqaga qaytish va jamoaviy ish", correct: true }, { text: "Internetni tezlashtiradi", correct: false }, { text: "Rang qo'shadi", correct: false }, { text: "Foydasiz", correct: false } ] },
          { question: "\"git commit\" nima qiladi?", options: [ { text: "O'zgarishlarni saqlaydi (versiya)", correct: true }, { text: "Saytni o'chiradi", correct: false }, { text: "Domen oladi", correct: false }, { text: "Video eksport qiladi", correct: false } ] },
          { question: "GitHub'ni Vercel'ga ulasak nima bo'ladi?", options: [ { text: "Sayt avtomatik internetga chiqadi", correct: true }, { text: "Hech narsa", correct: false }, { text: "Kod o'chadi", correct: false }, { text: "Internet uziladi", correct: false } ] },
        ] },
    ]
  },
  {
    id: 'aia-10', phase: 1, topic: 2, title: "O'z Telegram botingizni yasash", xp: 160,
    steps: [
      { type: 'video', title: "Video dars: Telegram Bot Agent",
        content: `Birinchi haqiqiy AI interfeysi — Telegram sotuv botini quramiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Bot, API va Agent",
        content: `**Bu darsda nimani o'rganamiz?**\n- 24/7 ishlaydigan AI sotuv botini Telegram'da qurishni.\n- Bot, API va agent so'zlari nimani anglatishini.\n\n**Oddiy bot va aqlli agent farqi**\nOddiy bot faqat oldindan yozilgan tayyor javobni qaytaradi. Agent esa AI yordamida o'ylab, tirik insondek tabiiy javob beradi.\n\n**API — dasturlarni bog'lovchi ko'prik**\nAPI (bir dastur ikkinchisi bilan "gaplashadigan" usul) AI'ni botga ulab turadi: bot → API → AI → API → bot. Ofitsiant kabi: siz buyurtma berasiz, u oshxonaga yetkazadi va taomni qaytarib keladi.\n\n**Telegram bot qanday xabar oladi?**\nBot Telegram serveridan "yangi xabar bormi?" deb doimiy so'rab turadi — buni **polling** (doimiy so'rab turish) deyiladi — va kelgan xabarga javob beradi.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Qaysi vositalar?** Cursor, Python yoki Node.js, Claude API / Groq API.\n\n**Amaliyot:**\n1. Cursor orqali Telegram bot kodini (orqa qism) yozing.\n2. **API kalitlarini** ulang: BotFather'dan token, Claude/Groq'dan kalit. API kaliti — AI'ga ulanish uchun "parol" kabi. **BotFather** — Telegram ichidagi, yangi bot yaratib beruvchi rasmiy bot.\n3. Botga **system prompt** (asosiy ko'rsatma) bering: "Sen professional sotuvchisan, muloyim va ishonchli gapir". Bu — botning xarakteri va qoidalari.\n4. Mijozlar bilan tabiiy tilda muloqotni yo'lga qo'ying.\n\nNatija: 24 soat, kunda 7 kun ishlaydigan AI sotuvchi.` },
      { type: 'info', title: "Eslab qoling",
        content: `**Eslab qoling**\n- Oddiy bot tayyor javob beradi; agent esa AI bilan o'ylab, tabiiy javob beradi.\n- API — ikki dasturni bog'lovchi ko'prik; bot AI bilan API orqali "gaplashadi".\n- BotFather'dan token, AI'dan API kaliti olinadi — ikkalasi ham "parol" kabi.\n- System prompt botning xarakteri va qoidalarini belgilaydi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Agent oddiy botdan farqi nima?", options: [ { text: "O'ylab, AI bilan tabiiy javob beradi", correct: true }, { text: "Tezroq ishlaydi", correct: false }, { text: "Rang ko'p", correct: false }, { text: "Farqi yo'q", correct: false } ] },
          { question: "REST API nima?", options: [ { text: "Dasturlar o'zaro \"gaplashadigan\" til", correct: true }, { text: "Rasm formati", correct: false }, { text: "Brauzer", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Telegram botga token qayerdan olinadi?", options: [ { text: "BotFather'dan", correct: true }, { text: "Google'dan", correct: false }, { text: "Photoshop'dan", correct: false }, { text: "Excel'dan", correct: false } ] },
          { question: "System Prompt nima qiladi?", options: [ { text: "Botning rolini/xarakterini belgilaydi", correct: true }, { text: "Internetni tezlashtiradi", correct: false }, { text: "Domen oladi", correct: false }, { text: "Video yasaydi", correct: false } ] },
          { question: "Polling nima?", options: [ { text: "Bot yangi xabarlarni doimiy so'rab turadi", correct: true }, { text: "Ovoz yozish", correct: false }, { text: "Rasm chizish", correct: false }, { text: "Domen olish", correct: false } ] },
          { question: "API'ni nimaga qiyoslaymiz?", options: [ { text: "AI'ning asab tizimiga", correct: true }, { text: "Rasmga", correct: false }, { text: "Ovozga", correct: false }, { text: "Hech narsaga", correct: false } ] },
          { question: "Qaysi tilda bot yoziladi (misol)?", options: [ { text: "Python yoki Node.js", correct: true }, { text: "Excel formula", correct: false }, { text: "HTML faqat", correct: false }, { text: "Hech qaysi", correct: false } ] },
          { question: "Groq API nima uchun yaxshi?", options: [ { text: "Tezkor va bepul logikalar uchun", correct: true }, { text: "Rasm chizish", correct: false }, { text: "Video montaj", correct: false }, { text: "Domen sotish", correct: false } ] },
          { question: "Bot mijoz bilan qanday gaplashadi?", options: [ { text: "Tabiiy tilda (AI orqali)", correct: true }, { text: "Faqat tugmalar bilan", correct: false }, { text: "Faqat raqam bilan", correct: false }, { text: "Gaplashmaydi", correct: false } ] },
          { question: "API kaliti nima uchun kerak?", options: [ { text: "AI modeliga ulanish va ruxsat uchun", correct: true }, { text: "Rang tanlash", correct: false }, { text: "Internet tezligi", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Telegram botni qanday ishga tushirish mumkin?", options: [ { text: "Serverga deploy qilib, 24/7 ishlatish", correct: true }, { text: "Faqat kompyuter yonida bo'lib", correct: false }, { text: "Telegram o'zi ishlatadi", correct: false }, { text: "Imkonsiz", correct: false } ] },
          { question: "BotFather nima?", options: [ { text: "Telegram botlarini yaratish va boshqarish boti", correct: true }, { text: "Dasturlash tili", correct: false }, { text: "Hosting xizmati", correct: false }, { text: "API turi", correct: false } ] },
          { question: "Sotuv botida AI nimani ta'minlaydi?", options: [ { text: "Tabiiy tilda muloqot va aqlli javoblar", correct: true }, { text: "Faqat narxlarni chiqaradi", correct: false }, { text: "Video yuboradi", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Claude API nima?", options: [ { text: "Anthropic'ning AI modeli bilan ishlash interfeysi", correct: true }, { text: "Telegram API", correct: false }, { text: "Rasm API", correct: false }, { text: "Domen API", correct: false } ] },
          { question: "Bot system promptida nimalar bo'lishi kerak?", options: [ { text: "Rol, mahsulot haqida ma'lumot va qoidalar", correct: true }, { text: "Faqat ism", correct: false }, { text: "Kod", correct: false }, { text: "Hech narsa", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', question: "REST API nima va Telegram bot uchun nima uchun kerak?", keywords: ["ulanish", "xabar", "kommunikatsiya", "dastur", "request", "response", "telegram server"], modelAnswer: "REST API — dasturlar o'zaro ma'lumot almashishi uchun standart interfeys. Telegram bot API orqali bot Telegram serveriga ulanib, xabarlarni qabul qiladi va javob yuboradi." },
          { type: 'text', question: "System Prompt nima va uni qanday yozish kerak?", keywords: ["rol", "qoida", "xarakter", "ko'rsatma", "instruction", "nima qilish", "nima qilmaslik"], modelAnswer: "System Prompt botga berilgan ko'rsatmalar to'plami: qanday gapirish, nimani bilish, qanday muloqot qilish va nimadan bosh tortish kerakligi." },
          { type: 'text', question: "Bot agenti oddiy chatbot dan nimasi bilan farq qiladi?", keywords: ["o'ylaydi", "qaror", "kontekst", "ai", "mantiq", "aqlli", "tahlil", "tushunadi"], modelAnswer: "Agent AI modeli orqali mijozning so'rovini tahlil qilib, kontekstga qarab javob beradi. Oddiy bot esa oldindan yozilgan tayyor javoblarni qaytaradi." },
          { type: 'text', question: "Telegram bot qaysi holatda 24/7 ishlashi mumkin?", keywords: ["server", "deploy", "cloud", "hosting", "vercel", "render", "doimiy", "vps"], modelAnswer: "Bot serverga (masalan: Render, Railway, VPS) deploy qilinsa, kompyuter yoqilmagan bo'lsa ham doim ishlaydi." },
          { type: 'text', question: "Sotuv botini qaysi turdagi biznes uchun qilish maqsadga muvofiq?", keywords: ["savdo", "do'kon", "mijoz", "xizmat", "mahsulot", "buyurtma", "narx", "sotuv"], modelAnswer: "Tovar yoki xizmat sotadigan har qanday biznes: onlayn do'kon, restoran, fitnes markazi, kurs platformasi — 24/7 mijozlar savollariga javob berish uchun." },
        ] },
    ]
  },
  {
    id: 'aia-11', phase: 1, topic: 3, title: "O'zi ish bajaradigan AI yordamchi (agentlar)", xp: 170,
    steps: [
      { type: 'video', title: "Video dars: Avtonom Agentlar va MCP",
        content: `Botga mustaqillik — o'zi qaror qabul qilish qobiliyatini qo'shamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: ReAct va MCP",
        content: `**Bu darsda nimani o'rganamiz?**\n- O'zi qaror qabul qilib, ish bajaradigan AI yordamchi (agent) nima ekanini.\n- Agent qanday "o'ylab harakat qilishini" (ReAct) va unga tashqi "asboblar" ulashni (MCP).\n\n**Avtonom agent** — o'zi **qaror qabul qiladigan** AI. Qidirsinmi, hisoblasinmi, biror dasturni chaqirsinmi — buni o'zi hal qiladi.\n\n💡 **Oddiy o'xshatish:** agent — bu kotib kabi. Siz topshiriq berasiz ("bu ishni bajar"), u esa qaysi qadamlarni qilishni o'zi o'ylab, birin-ketin bajaradi.\n\n**ReAct (o'ylab-harakat qilish):** agent fikrlaydi → harakat qiladi → natijani ko'radi → yana fikrlaydi. Maqsadga yetguncha shu takrorlanadi.\n\n**MCP (agentga "asboblar" berish standarti)** — agentga tashqi **funksiyalar (Tools — asboblar)** ulash usuli. Masalan "ob-havo asbobi", "valyuta asbobi". Kerak bo'lganda agent o'zi shu asbobni ishlatadi.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vositalar:** Cursor, Claude Desktop, MCP Local Servers.\n\n**Amaliyot:**\n- 10-darsdagi sotuv botiga **mustaqillik** qo'shing.\n- Agentga tashqi xizmatdan (masalan valyuta kursi yoki ob-havo) **o'zi** ma'lumot topib, tahlil qilib javob beradigan qism yozing.\n\n**Misol:** mijoz "dollar kursi qancha?" desa, agent o'zi valyuta asbobini ishlatib, javob beradi — siz har safar qo'lda yozib o'tirmaysiz.` },
      { type: 'info', title: "Eslab qoling",
        content: `**Eslab qoling**\n- Avtonom agent o'zi qaror qabul qilib harakat qiladi — kotib kabi.\n- ReAct sikli: fikrlash → harakat → natijani ko'rish → yana fikrlash, maqsadga yetguncha.\n- MCP — agentga tashqi asboblar (Tools, masalan valyuta yoki ob-havo) ulash standarti.\n- Agent kerakli asbobni o'zi tanlab ishlatadi; siz har safar qo'lda yozmaysiz.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Avtonom agent nima qiladi?", options: [ { text: "O'zi qaror qabul qilib harakat qiladi", correct: true }, { text: "Faqat kutadi", correct: false }, { text: "Rasm chizadi", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "ReAct nimaning qisqartmasi?", options: [ { text: "Reasoning + Acting", correct: true }, { text: "Read + Act", correct: false }, { text: "Real + Action", correct: false }, { text: "React (kutubxona)", correct: false } ] },
          { question: "MCP nima beradi?", options: [ { text: "Agentga funksiyalar (Tools)", correct: true }, { text: "Rang", correct: false }, { text: "Domen", correct: false }, { text: "Ovoz", correct: false } ] },
          { question: "Agent tool'ni qachon chaqiradi?", options: [ { text: "Kerak bo'lsa, o'zi qaror qilib", correct: true }, { text: "Hech qachon", correct: false }, { text: "Faqat tunda", correct: false }, { text: "Foydalanuvchi bossa", correct: false } ] },
          { question: "ReAct sikli qanday?", options: [ { text: "Fikrlash → Harakat → Natija → takror", correct: true }, { text: "Faqat fikrlash", correct: false }, { text: "Faqat harakat", correct: false }, { text: "Tasodifiy", correct: false } ] },
          { question: "\"Tool\" nima?", options: [ { text: "Agent chaqira oladigan funksiya (masalan ob-havo)", correct: true }, { text: "Bolg'a", correct: false }, { text: "Rasm", correct: false }, { text: "Parol", correct: false } ] },
          { question: "Valyuta misolida agent nima qiladi?", options: [ { text: "O'zi valyuta toolini chaqirib javob beradi", correct: true }, { text: "Hech narsa", correct: false }, { text: "Rasm yuboradi", correct: false }, { text: "Botni o'chiradi", correct: false } ] },
          { question: "Claude Desktop bu nima?", options: [ { text: "MCP tool'lari bilan ishlaydigan dastur", correct: true }, { text: "O'yin", correct: false }, { text: "Brauzer", correct: false }, { text: "Antivirus", correct: false } ] },
          { question: "Avtonomlik nima afzallik beradi?", options: [ { text: "Agent o'zi ma'lumot topib tahlil qiladi", correct: true }, { text: "Sekinlashadi", correct: false }, { text: "Rang ko'payadi", correct: false }, { text: "Afzallik yo'q", correct: false } ] },
          { question: "MCP'ning to'liq nomi?", options: [ { text: "Model Context Protocol", correct: true }, { text: "Main Code Process", correct: false }, { text: "Model Color Palette", correct: false }, { text: "My Custom Page", correct: false } ] },
          { question: "Agent va RPA (Robotic Process Automation) farqi nima?", options: [ { text: "Agent AI orqali qaror qiladi, RPA esa qat'iy skriptlarga amal qiladi", correct: true }, { text: "Farqi yo'q", correct: false }, { text: "RPA aqlliroq", correct: false }, { text: "Agent sekinroq", correct: false } ] },
          { question: "Agentni qaysi holat uchun ishlatish maqsadga muvofiq?", options: [ { text: "Ko'p qadam kerak bo'lganda va qaror olishda", correct: true }, { text: "Faqat rasm chizishda", correct: false }, { text: "Faqat tarjimada", correct: false }, { text: "Oddiy savollarda ham", correct: false } ] },
          { question: "Agent loop qachon to'xtaydi?", options: [ { text: "Maqsadga yetganda yoki xato bo'lganda", correct: true }, { text: "Hech qachon", correct: false }, { text: "Har 1 soniyada", correct: false }, { text: "Foydalanuvchi bosmaguncha", correct: false } ] },
          { question: "MCP server nima?", options: [ { text: "Agentga toollarni taqdim etuvchi mahalliy server", correct: true }, { text: "Internet server", correct: false }, { text: "Domen server", correct: false }, { text: "Rasm serveri", correct: false } ] },
          { question: "Multi-agent tizim nima?", options: [ { text: "Bir nechta agent birgalikda murakkas vazifani bajaradi", correct: true }, { text: "Ko'p foydalanuvchi", correct: false }, { text: "Ko'p server", correct: false }, { text: "Ko'p API kaliti", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', question: "ReAct (Reasoning + Acting) sikli qanday ishlaydi? Qadamlarni yozing.", keywords: ["fikrlash", "harakat", "natija", "takror", "loop", "qaror", "observe"], modelAnswer: "1) Fikrlash (nima qilish kerak?), 2) Harakat (tool chaqirish yoki javob berish), 3) Natijani ko'rish, 4) Yana fikrlash — maqsadga yetguncha davom etadi." },
          { type: 'text', question: "MCP (Model Context Protocol) nima va nega kerak?", keywords: ["tool", "funksiya", "agent", "standart", "protocol", "ulash", "imkoniyat"], modelAnswer: "MCP agentga tashqi funksiyalar (toollar) berishning standart usuli. Agent bu toollar orqali hisoblash, qidiruv, API chaqirish va boshqa amallarni bajarishi mumkin." },
          { type: 'text', question: "Avtonom agent oddiy AI chatbot dan qanday farq qiladi?", keywords: ["qaror", "tool", "mustaqil", "harakat", "bir necha qadam", "loop", "o'zi"], modelAnswer: "Chatbot faqat javob beradi; avtonom agent esa bir necha qadamda o'zi qaror qilib, toollardan foydalanib, maqsadga yetadi. U mustaqil harakat qiladi." },
          { type: 'text', question: "O'zingizning biznesingiz uchun qanday AI agent qurish mumkin? Qisqacha misol keltiring.", keywords: ["sotuv", "xizmat", "buyurtma", "qidiruv", "javob", "bilim", "mijoz", "tool"], modelAnswer: "Masalan: onlayn do'kon uchun agent — narx qidirish tooli, buyurtma tooli va mijoz tarixi tooliga ega bo'ladi. Mijoz so'rasa, agent o'zi kerakli toolni chaqiradi." },
          { type: 'text', question: "Agent 'loop' qachon to'xtashi kerak va bu nima uchun muhim?", keywords: ["maqsad", "xato", "limit", "to'xtash", "cheksiz", "maksimal", "break"], modelAnswer: "Agent maqsadga yetganda yoki maksimal qadam chegarasiga yetganda to'xtaydi. Bu muhim, chunki cheksiz loop tizimni sekinlashtiradi va keraksiz xarajat keltirib chiqaradi." },
        ] },
    ]
  },
  {
    id: 'aia-12', phase: 1, topic: 4, title: "AI ga xotira va bilim berish (RAG)", xp: 170,
    steps: [
      { type: 'video', title: "Video dars: RAG va Vektor Bazalari",
        content: `Botga chuqur xotira — o'z bazangizdan javob berishni qo'shamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Vektor baza va Embedding",
        content: `**Bu darsda nimani o'rganamiz?**\n- AI'ga o'z hujjatlaringizni (narxlar, mahsulotlar) "xotira" qilib berishni.\n- Bot xato to'qimasdan, faqat sizning ma'lumotingizdan javob berishini (buni RAG deyiladi).\n\n7-darsda RAG bilan tanishdik. Endi uni o'z botingizga "chuqur xotira" sifatida ulaymiz. Buning uchun 3 ta tushuncha kerak:\n\n- 🔢 **Embedding** — matnni **raqamlarga (vektorga)** aylantirish. Ma'nosi yaqin matnlar bir-biriga yaqin raqamlar oladi.\n- ✂️ **Chunking** — katta hujjatni mantiqiy **bo'laklarga** bo'lish (har bo'lak alohida saqlanadi).\n- 🗄️ **Vektor baza** — shu raqamlarni saqlab, savolga **ma'no jihatdan** (kalit so'z emas, ma'no bo'yicha) eng yaqin bo'lakni tez topadigan ombor.\n\n**Tartibi:** hujjat → bo'laklarga bo'lish → raqamga aylantirish → vektor bazaga saqlash → savol kelganda eng mos bo'lakni topib AI'ga berish.\n\n💡 **Hayotiy misol:** vektor baza — kutubxonachi kabi. Siz savol berasiz, u butun kutubxonadan aynan kerakli sahifani topib beradi — AI esa faqat o'sha sahifaga qarab javob beradi.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Qaysi vositalar?** Pinecone yoki Qdrant (vektor baza xizmatlari, bepul versiyasi bor), Gemini/OpenAI Embedding API (matnni raqamga o'giruvchi xizmat).\n\n**Amaliyot:**\n- Narxlar va mahsulotlar ro'yxati yozilgan **PDF**ni raqamga o'girib **Pinecone**'ga yuboring.\n- Endi bot **xato to'qimaydi** — faqat sizning bazangizdagi ma'lumotdan javob beradi.\n\nNatija: bot "narx qancha?" deganda o'ylab topmaydi — bazadagi aniq narxni aytadi.` },
      { type: 'info', title: "Eslab qoling",
        content: `**Eslab qoling**\n- RAG — AI'ga o'z hujjatlaringizdan javob berishni o'rgatadi; xato to'qishni kamaytiradi.\n- Embedding — matnni raqamlarga aylantiradi; ma'nosi yaqin matnlar yaqin raqamlar oladi.\n- Chunking — katta hujjatni kichik bo'laklarga ajratish.\n- Vektor baza — savolga ma'no jihatdan eng yaqin bo'lakni topadi (kutubxonachi kabi).` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Embedding nima qiladi?", options: [ { text: "Matnni vektorga (raqamlarga) aylantiradi", correct: true }, { text: "Rasmni siqadi", correct: false }, { text: "Videoni qisqartiradi", correct: false }, { text: "Domen oladi", correct: false } ] },
          { question: "Chunking nima?", options: [ { text: "Hujjatni mantiqiy bo'laklarga ajratish", correct: true }, { text: "Faylni o'chirish", correct: false }, { text: "Rang tanlash", correct: false }, { text: "Parol yaratish", correct: false } ] },
          { question: "Vektor baza qanday qidiradi?", options: [ { text: "Ma'no (semantik) jihatdan eng yaqin bo'lakni", correct: true }, { text: "Faqat aniq kalit so'z bo'yicha", correct: false }, { text: "Tasodifan", correct: false }, { text: "Rang bo'yicha", correct: false } ] },
          { question: "Qaysi vektor baza vositasi?", options: [ { text: "Pinecone", correct: true }, { text: "Photoshop", correct: false }, { text: "Telegram", correct: false }, { text: "Excel", correct: false } ] },
          { question: "RAG bilan bot narx so'ralganda nima qiladi?", options: [ { text: "Bazadagi aniq narxni aytadi", correct: true }, { text: "O'ylab topadi", correct: false }, { text: "Javob bermaydi", correct: false }, { text: "Internetdan qidiradi", correct: false } ] },
          { question: "Semantik masofa nima?", options: [ { text: "Ma'no jihatdan yaqinlik o'lchovi", correct: true }, { text: "Ikki shahar orasi", correct: false }, { text: "Internet tezligi", correct: false }, { text: "Fayl hajmi", correct: false } ] },
          { question: "To'g'ri jarayon qaysi?", options: [ { text: "Hujjat → chunk → embedding → vektor baza", correct: true }, { text: "Video → audio → rasm", correct: false }, { text: "Domen → hosting", correct: false }, { text: "Faqat embedding", correct: false } ] },
          { question: "Ma'no yaqin matnlar vektor fazosida qanday?", options: [ { text: "Bir-biriga yaqin turadi", correct: true }, { text: "Juda uzoq", correct: false }, { text: "Bog'liq emas", correct: false }, { text: "Yo'qoladi", correct: false } ] },
          { question: "RAG gallyutsinatsiyani kamaytiradimi?", options: [ { text: "Ha — faqat bazadan javob beradi", correct: true }, { text: "Yo'q, oshiradi", correct: false }, { text: "Ta'sir yo'q", correct: false }, { text: "Modelni o'chiradi", correct: false } ] },
          { question: "Qdrant nima?", options: [ { text: "Vektor ma'lumotlar bazasi", correct: true }, { text: "Brauzer", correct: false }, { text: "Ovoz dasturi", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Overlap chunking nima uchun kerak?", options: [ { text: "Bo'laklar o'rtasida kontekst saqlanishi uchun", correct: true }, { text: "Faylni o'chirish uchun", correct: false }, { text: "Rasmni kattalashtirish uchun", correct: false }, { text: "Internetni tezlashtirish uchun", correct: false } ] },
          { question: "Embedding modeli qaysi kompaniya taqdim etadi?", options: [ { text: "OpenAI, Google (Gemini), Cohere", correct: true }, { text: "Faqat Adobe", correct: false }, { text: "Faqat Microsoft", correct: false }, { text: "Faqat Apple", correct: false } ] },
          { question: "RAG tizimida qaysi qism eng muhim?", options: [ { text: "Sifatli bilimlar bazasi (hujjatlar)", correct: true }, { text: "Eng qimmat model", correct: false }, { text: "Ko'p token", correct: false }, { text: "Tez internet", correct: false } ] },
          { question: "NotebookLM va Pinecone o'rtasidagi farq?", options: [ { text: "NotebookLM tayyor interfeys, Pinecone dasturchilar uchun API", correct: true }, { text: "Farqi yo'q", correct: false }, { text: "NotebookLM to'lovli", correct: false }, { text: "Pinecone faqat rasmlar uchun", correct: false } ] },
          { question: "RAG tizimi qachon eng yaxshi ishlaydi?", options: [ { text: "Baza aniq, toza va yangilangan bo'lganda", correct: true }, { text: "Hujjatlar ko'p bo'lganda (miqdor muhim)", correct: false }, { text: "Model qimmat bo'lganda", correct: false }, { text: "Internet tez bo'lganda", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', question: "RAG (Retrieval-Augmented Generation) jarayonini qadamlar bilan tushuntirib bering.", keywords: ["hujjat", "bo'lak", "chunk", "embedding", "vektor", "qidirish", "kontekst", "javob"], modelAnswer: "1) Hujjat bo'laklarga (chunk) bo'linadi, 2) Har bo'lak embedding (vektori) hosil qilinadi, 3) Vektor bazaga saqlanadi, 4) Savol kelganda semantik qidiruv bilan eng mos bo'lak topiladi, 5) U kontekst sifatida AI modeliga beriladi, 6) Model shu asosda javob beradi." },
          { type: 'text', question: "Embedding nima va u RAG da qanday rol o'ynaydi?", keywords: ["vektor", "raqam", "ma'no", "matematik", "semantik", "aylantirish", "yaqinlik"], modelAnswer: "Embedding — matnni raqamlar (vektor) to'plamiga aylantirish. Ma'no jihatdan yaqin matnlar matematikal jihatdan ham yaqin vektorlarga ega bo'ladi. RAG'da qidiruv shu vektorlar orqali amalga oshiriladi." },
          { type: 'text', question: "Chunking strategiyasi nima va nima uchun muhim?", keywords: ["bo'lak", "o'lcham", "overlap", "mantiqiy", "ajratish", "kontekst", "qidiruv"], modelAnswer: "Chunking — katta hujjatni kichik mantiqiy bo'laklarga ajratish usuli. To'g'ri o'lcham qidiruvni aniqlashtiradi. Overlap esa bo'laklar o'rtasida kontekst uzilishini oldini oladi." },
          { type: 'text', question: "RAG tizimini qaysi turdagi biznes uchun qo'llash mumkin? Misol keltiring.", keywords: ["do'kon", "support", "qo'llab", "savol", "mahsulot", "hujjat", "mijoz", "yuridik", "tibbiy", "ta'lim"], modelAnswer: "Har qanday biznes uchun: mijozlar xizmatida (FAQ bazasi), yuridik firmalar uchun (qonunlar bazasi), ta'lim platformalari uchun (kurs materiallari), onlayn do'konlar uchun (mahsulot ma'lumotlari)." },
          { type: 'text', question: "RAG gallyutsinatsiyani qanday kamaytiradi?", keywords: ["baza", "faqat", "hujjat", "cheklash", "kontekst", "to'g'ri", "manba", "tasdiqlash"], modelAnswer: "RAG modelga faqat ma'lum hujjatlar asosida javob berish imkonini beradi. Model o'z 'xayolidan' ixtiro qilmaydi, chunki unga faqat bazadan topilgan aniq kontekst beriladi." },
        ] },
    ]
  },
  {
    id: 'aia-13', phase: 1, topic: 5, title: "Rasm va ovozni tushunadigan AI", xp: 170,
    steps: [
      { type: 'video', title: "Video dars: Multimodal Agent",
        content: `Botni "ko'radigan va eshitadigan" qilamiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: STT va Vision",
        content: `**Bu darsda nimani o'rganamiz?**\n- Botni "eshitadigan va ko'radigan" qilishni — ovoz va rasmni tushunadigan.\n- Mijoz ovoz yoki rasm yuborganda bot qanday javob berishini.\n\n**Multimodal AI** — bir nechta turdagi ma'lumotni (matn, ovoz, rasm) tushunadigan AI. Endi botingiz nafaqat o'qiy oladi, balki "eshitadi" va "ko'radi".\n\n- 🎤 **STT** (ovozdan matn — Speech-to-Text) — ovozli xabarni matnga aylantiradi (Whisper modeli). Aksi — **TTS** (matndan ovoz — Text-to-Speech) — matnni ovozga aylantiradi.\n- 👁️ **Vision** (ko'rish) — rasmni "ko'rib", unda nima borligini tushunadi.\n\nTelegramda mijoz ovozli xabar yoki rasm yuboradi → bot uni AI'ga uzatadi → AI tahlil qilib javob beradi.\n\n💡 **O'zbek bozori uchun muhim:** ko'pchilik yozishni emas, **gapirishni yoki rasm yuborishni** afzal ko'radi — shuning uchun bu funksiya savdoni oshiradi.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vositalar:** Groq API (Whisper — tezkor ovoz tahlili), Gemini 1.5 Flash Vision.\n\n**Amaliyot:**\n- Mijoz yuborgan **ovozli xabarni** tushunadigan qism (STT).\n- Mijoz yuborgan **kiyim/mahsulot rasmini** ko'rib, bazadan o'xshashini topib beradigan qism (Vision + RAG).\n\nNatija: mijoz rasm yuboradi — bot "shunga o'xshash mahsulot bazada bor" deb javob beradi.` },
      { type: 'info', title: "Eslab qoling",
        content: `**Eslab qoling**\n- Multimodal AI matn, ovoz va rasmni birga tushunadi.\n- STT (Whisper) ovozni matnga aylantiradi; TTS aksincha — matnni ovozga.\n- Vision rasmni "ko'rib", undagi narsalarni aniqlaydi.\n- O'zbek bozorida ko'pchilik gapirish/rasm yuborishni afzal ko'radi — bu funksiya savdoni oshiradi.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Multimodal AI nima?", options: [ { text: "Matn, ovoz va rasmni tushunadi", correct: true }, { text: "Faqat matn", correct: false }, { text: "Faqat rasm", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "STT nima qiladi?", options: [ { text: "Ovozni matnga aylantiradi", correct: true }, { text: "Matnni ovozga", correct: false }, { text: "Rasm yasaydi", correct: false }, { text: "Video montaj", correct: false } ] },
          { question: "Whisper modeli nima uchun?", options: [ { text: "Ovozni matnga o'girish (STT)", correct: true }, { text: "Rasm chizish", correct: false }, { text: "Kod yozish", correct: false }, { text: "Domen olish", correct: false } ] },
          { question: "Vision model nima qiladi?", options: [ { text: "Rasmni ko'rib tahlil qiladi", correct: true }, { text: "Ovoz yozadi", correct: false }, { text: "Internet tezligini oshiradi", correct: false }, { text: "Parol yaratadi", correct: false } ] },
          { question: "Nega O'zbek bozorida ovoz/rasm muhim?", options: [ { text: "Ko'pchilik gapirish/rasm yuborishni afzal ko'radi", correct: true }, { text: "Internet yo'q", correct: false }, { text: "Matn taqiqlangan", correct: false }, { text: "Sabab yo'q", correct: false } ] },
          { question: "Groq API qanday afzallik beradi?", options: [ { text: "Tezkor ovoz tahlili", correct: true }, { text: "Sekin lekin arzon", correct: false }, { text: "Faqat rasm", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Mijoz rasm yuborsa bot nima qiladi?", options: [ { text: "Tahlil qilib bazadan o'xshashini topadi", correct: true }, { text: "O'chiradi", correct: false }, { text: "Hech narsa", correct: false }, { text: "Faqat saqlaydi", correct: false } ] },
          { question: "Gemini 1.5 Flash Vision nima uchun?", options: [ { text: "Rasm tahlili (Vision)", correct: true }, { text: "Ovoz klonlash", correct: false }, { text: "Video montaj", correct: false }, { text: "Kod kompilyatsiya", correct: false } ] },
          { question: "Telegramdagi media qayerga uzatiladi?", options: [ { text: "AI modelga (to'g'ri arxitektura bilan)", correct: true }, { text: "Hech qayerga", correct: false }, { text: "Faqat diskka", correct: false }, { text: "Printerga", correct: false } ] },
          { question: "Multimodal + RAG birga nima beradi?", options: [ { text: "Rasm/ovozdan tushunib, bazadan aniq javob", correct: true }, { text: "Faqat sekinlik", correct: false }, { text: "Hech narsa", correct: false }, { text: "Xato", correct: false } ] },
          { question: "TTS nima?", options: [ { text: "Matnni ovozga aylantirish (Text-to-Speech)", correct: true }, { text: "Rasm formati", correct: false }, { text: "Domen turi", correct: false }, { text: "API turi", correct: false } ] },
          { question: "Vision modeli qaysi ma'lumotni qayta ishlaydi?", options: [ { text: "Rasm va video", correct: true }, { text: "Faqat matn", correct: false }, { text: "Faqat ovoz", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Multimodal agent bitta savolga qanday javob berishi mumkin?", options: [ { text: "Ovoz, rasm va matnni birgalikda tahlil qilib", correct: true }, { text: "Faqat bitta formatda", correct: false }, { text: "Hech javob bermaydi", correct: false }, { text: "Faqat ovoz bilan", correct: false } ] },
          { question: "O'zbek tilida STT qilish uchun qaysi model mos?", options: [ { text: "Whisper (OpenAI/Groq) — ko'p tilni qo'llab-quvvatlaydi", correct: true }, { text: "Faqat inglizcha model", correct: false }, { text: "ElevenLabs faqat", correct: false }, { text: "Hech qaysi", correct: false } ] },
          { question: "Telegramdagi ovozli xabarni tahlil qilish jarayoni?", options: [ { text: "Ovoz → STT (matn) → AI model → Javob", correct: true }, { text: "Ovoz → Rasm → Matn", correct: false }, { text: "Matn → Ovoz → Rasm", correct: false }, { text: "Hech narsa", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', question: "Multimodal AI nima va u biznesga qanday foyda keltiradi?", keywords: ["ovoz", "rasm", "matn", "formatlar", "qulay", "mijoz", "tushunish", "tahlil"], modelAnswer: "Multimodal AI bir vaqtda matn, ovoz va rasmni tushuna oladi. Mijozlar xohlagan formatda muloqot qilishi mumkin — bu qulay tajriba yaratadi va savdoni oshiradi." },
          { type: 'text', question: "STT (Speech-to-Text) va TTS (Text-to-Speech) farqini tushuntirib bering.", keywords: ["ovoz matnga", "matn ovozga", "whisper", "elevenlabs", "aylantirish", "o'girish"], modelAnswer: "STT (Whisper) — ovozni matnga aylantiradi. TTS (ElevenLabs) — matnni ovozga aylantiradi. STT kirish (input), TTS chiqish (output) uchun ishlatiladi." },
          { type: 'text', question: "Qaysi turdagi biznes multimodal AI agentdan eng ko'p foyda ko'radi?", keywords: ["do'kon", "kiyim", "mahsulot", "rasm", "ovoz", "savdo", "restoran", "tahlil", "vizual"], modelAnswer: "Kiyim-kechak do'konlari (rasm tahlili narx uchun), restoranlar (ovozli buyurtma), ko'chmas mulk (rasm tahlili), tibbiyot (rasm diagnostika) — vizual va ovozli kirish kerak bo'lgan sohalarda." },
          { type: 'text', question: "Vision model qanday ishlaydi va u nimani 'ko'radi'?", keywords: ["rasm", "tahlil", "ob'ekt", "ko'radi", "aniqlaydi", "pixel", "model", "tushunadi"], modelAnswer: "Vision model rasmni mayda bo'laklarga (patch) ajratib, ularni matematik vektorlarga aylantiradi va ular orasidagi bog'liqlikni o'rganadi. Natijada ob'ektlar, matn, rang va kontekstni aniqlaydi." },
          { type: 'text', question: "Multimodal agent qurish uchun qanday komponentlar kerak?", keywords: ["llm", "vision", "stt", "tts", "whisper", "api", "bot", "arxitektura", "komponent"], modelAnswer: "1) LLM (Claude/Gemini) — fikrlash uchun, 2) Vision model (Gemini Flash) — rasm uchun, 3) STT (Whisper/Groq) — ovoz uchun, 4) Bot interfeysi (Telegram), 5) Integratsiya kodi (Python)." },
        ] },
    ]
  },
  {
    id: 'aia-15', phase: 1, topic: 7, title: "Yakuniy loyiha: hammasini birlashtirish", xp: 200,
    steps: [
      { type: 'video', title: "Video dars: Final Loyiha",
        content: `Hamma bilimlarni bitta to'laqonli loyihaga yig'amiz.`,
        video: { url: '', note: 'Video tez orada qo\'shiladi' } },
      { type: 'info', title: "Nazariya: Tizimni birlashtirish",
        content: `**Bu darsda nimani o'rganamiz?**\n- Kurs davomida o'rgangan hamma narsani bitta ishlaydigan loyihaga birlashtirishni.\n- Tayyor mahsulotni barqaror va xavfsiz qilishning asosiy tushunchalarini.\n\n**Yakuniy loyiha** — kurs davomida o'rgangan hamma narsani **bitta tizimga** yig'asiz:\n- 🖥️ Sayt ko'rinishi (Frontend)\n- 🧠 RAG xotira (o'z bazasi)\n- 🎤 Ovoz/Rasm tahlili (Multimodal)\n- 🛡️ Xavfsizlik (Guardrails va Router)\n\n**Yangi tushunchalar — sodda tilda:**\n- **Guardrails** (himoya qoidalari) — botga "nimani qilma" deb qo'yilgan chegaralar: behayo so'zlarga javob bermaslik, mavzudan chetga chiqmaslik. Yo'l chetidagi to'siq kabi — mashina ariqqa tushib ketmaydi.\n- **Router** (yo'naltirgich) — savolga qarab arzon yoki kuchli AI modelni tanlaydigan qism. Oddiy savolga arzon model, murakkab savolga kuchli model — shunday pul tejaladi.\n- **Sinxronizatsiya** — ko'rinadigan va ko'rinmas qism o'rtasida ma'lumot bir xil bo'lishi.\n- **Error-handling** (xatoni ushlash) — kutilmagan xato chiqsa bot **o'chib qolmaydi**, balki xatoni ushlab, muloyim javob beradi.` },
      { type: 'info', title: "Vositalar va amaliyot",
        content: `**Vositalar:** Kursdagi barcha asboblar + GitHub + Vercel.\n\n**Amaliyot:**\n- Sayt, RAG xotira, Ovoz/Rasm tahlili va Xavfsizlikni o'z ichiga olgan **to'laqonli avtonom sotuv agentini** bitta loyihaga yig'ing.\n- Loyihani **GitHub**'ga yuklang.\n- Serverda **24 soat, doimiy** ishlashi uchun **deploy** qiling.\n\nBu — sizning real portfolio (ko'rgazma) loyihangiz!` },
      { type: 'info', title: "Eslab qoling",
        content: `**Eslab qoling**\n- Yakuniy loyiha — Frontend, RAG, Multimodal va Xavfsizlikni bitta tizimga birlashtirish.\n- Guardrails — botning himoya qoidalari (to'siq); Router — savolga mos modelni tanlaydi.\n- Error-handling xatoda tizim o'chib qolishining oldini oladi.\n- Avval MVP (eng kichik ishlaydigan versiya) quring, foydalanuvchi ko'paysa kengaytiring (scaling); logging — xatolarni kuzatib borish.\n- Loyihani GitHub'ga yuklab, Vercel'ga deploy qiling — bu sizning portfolio loyihangiz.` },
      { type: 'finalquiz', title: "Yakuniy test",
        content: `10 ta savol. Kamida **7 tasiga** to'g'ri javob bering.`,
        questions: [
          { question: "Final loyiha nimani birlashtiradi?", options: [ { text: "Sayt, RAG, multimodal va xavfsizlik qatlamlarini", correct: true }, { text: "Faqat bitta rasmni", correct: false }, { text: "Faqat ovozni", correct: false }, { text: "Hech narsani", correct: false } ] },
          { question: "Error-handling nima?", options: [ { text: "Xatoda tizim o'chmasligini ta'minlash", correct: true }, { text: "Xatolarni ko'paytirish", correct: false }, { text: "Internet tezligi", correct: false }, { text: "Rang", correct: false } ] },
          { question: "Sinxronizatsiya nima?", options: [ { text: "Frontend va Backend ma'lumot mosligi", correct: true }, { text: "Ovoz balandligi", correct: false }, { text: "Domen narxi", correct: false }, { text: "Rasm filtri", correct: false } ] },
          { question: "24/7 ishlashi uchun nima kerak?", options: [ { text: "Serverga deploy qilish", correct: true }, { text: "Kompyuterni o'chirish", correct: false }, { text: "Faqat lokal ishlatish", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Loyiha qayerga yuklanadi?", options: [ { text: "GitHub'ga", correct: true }, { text: "Telegram'ga", correct: false }, { text: "Excel'ga", correct: false }, { text: "Hech qayerga", correct: false } ] },
          { question: "RAG qatlami nima beradi?", options: [ { text: "O'z bazasidan aniq javob", correct: true }, { text: "Rasm chizadi", correct: false }, { text: "Domen oladi", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Multimodal qatlam nima?", options: [ { text: "Ovoz va rasmni tushunish", correct: true }, { text: "Faqat matn", correct: false }, { text: "Faqat video", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Xavfsizlik qatlami nimani o'z ichiga oladi?", options: [ { text: "Guardrails va Router", correct: true }, { text: "Faqat rang", correct: false }, { text: "Faqat ovoz", correct: false }, { text: "Hech narsa", correct: false } ] },
          { question: "Bu loyiha sizga nima beradi?", options: [ { text: "Real portfolio loyihasi", correct: true }, { text: "Hech narsa", correct: false }, { text: "Faqat ball", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Deploy bo'lmasa nima bo'ladi?", options: [ { text: "Sayt internetda doimiy ishlamaydi", correct: true }, { text: "Hech narsa", correct: false }, { text: "Tezroq bo'ladi", correct: false }, { text: "Avtomatik ishlaydi", correct: false } ] },
          { question: "Loyiha arxitekturasi degan nima?", options: [ { text: "Tizimning qismlari va ular o'rtasidagi bog'liq", correct: true }, { text: "Bino loyihasi", correct: false }, { text: "Faqat dizayn", correct: false }, { text: "Kod stili", correct: false } ] },
          { question: "Scaling nima?", options: [ { text: "Foydalanuvchilar ko'paysa tizimni kengaytirish", correct: true }, { text: "Rasmni kattalashtirish", correct: false }, { text: "Font o'lchami", correct: false }, { text: "Internet tezligi", correct: false } ] },
          { question: "MVP (Minimum Viable Product) nima?", options: [ { text: "Asosiy funksiya ishlasa bas bo'lgan minimal versiya", correct: true }, { text: "Eng qimmat versiya", correct: false }, { text: "Faqat dizayn", correct: false }, { text: "Beta test", correct: false } ] },
          { question: "Logging nima uchun kerak?", options: [ { text: "Tizim xatolarini kuzatish va tahlil qilish", correct: true }, { text: "Foydalanuvchi ma'lumotini o'chirish", correct: false }, { text: "Rasmlarni saqlash", correct: false }, { text: "Internet tezligini o'lchash", correct: false } ] },
          { question: "Final loyihadagi asosiy maqsad nima?", options: [ { text: "Real muammoni hal qiluvchi ishlaydigan AI mahsulot", correct: true }, { text: "Faqat imtihon o'tish", correct: false }, { text: "Faqat kod yozish", correct: false }, { text: "Faqat dizayn", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', question: "Final loyiha uchun qaysi texnologiyalardan foydalanasiz va ularning roli nima?", keywords: ["frontend", "backend", "rag", "agent", "api", "telegram", "vercel", "github", "multimodal"], modelAnswer: "Veb-sayt (Frontend: HTML/CSS/JS), AI agent (Backend: Python + Claude API), RAG (Pinecone/Qdrant + Embedding), Multimodal (Whisper + Vision), Deploy (GitHub + Vercel/Render)." },
          { type: 'text', question: "Error-handling nima va u nega muhim?", keywords: ["xato", "o'chib", "exception", "try", "catch", "muloyim", "javob", "tizim"], modelAnswer: "Error-handling — tizim xato bo'lganda o'chib qolmasdan, muloyim xato xabari berishi. Foydalanuvchi uchun qulay tajriba va tizimning barqarorligi uchun juda muhim." },
          { type: 'text', question: "Loyihani GitHub'ga yuklash va Vercel'ga deploy qilishning afzalligi nima?", keywords: ["versiya", "internet", "doimiy", "jamoaviy", "CI/CD", "avtomatik", "jonli", "24/7"], modelAnswer: "GitHub — versiya nazorati va jamoaviy ish; Vercel — avtomatik deploy, CDN, bepul hosting. Birgalikda: har commit'da sayt avtomatik yangilanadi va 24/7 ishlaydi." },
          { type: 'text', question: "Kurs davomida nimalarni o'rgandingiz? Eng foydali deb topgan 3 ta narsani yozing.", keywords: ["vibe", "bot", "rag", "agent", "prompt", "canva", "gamma", "elevenlabs", "github", "deploy", "api"], modelAnswer: "Masalan: 1) AI bilan vibe coding — sayt qurish, 2) Telegram sotuv bot qurish, 3) RAG tizimi — AI ga o'z hujjatlarimni o'rgatish." },
          { type: 'text', question: "Bu kursdan keyin qanday AI mahsulot qurmoqchisiz?", keywords: ["bot", "sayt", "agent", "loyiha", "biznes", "yechim", "g'oya", "qurmoq", "qilmoq"], modelAnswer: "Har qanday g'oya qabul qilinadi — muhimi o'quvchi o'rganganlarini real loyihaga qo'llash niyatini bildirishi." },
        ] },
    ]
  },
  {
    id: 'aia-16', phase: 1, topic: 8, title: "2-bosqich: Yakuniy imtihon", xp: 300,
    steps: [
      { type: 'info', title: "Yakuniy imtihon haqida",
        content: `Tabriklaymiz — kursning oxiriga yetdingiz! 🎉\n\nBu **yakuniy imtihon** butun kurs bo'yicha bilimingizni tekshiradi:\n- **15 ta belgilash savoli** (har biri 1 ball)\n- **5 ta yozma savol** (har biri 2 ball)\n- **Jami: 25 ball**, o'tish uchun **18 ball** kerak.\n\n**Qaysi mavzulardan?** Buyruq (prompt) asoslari, AI qanday ishlashi, rasm/ovoz/video yaratish, kod yozmasdan sayt yasash, botlar, agentlar, RAG va saytni internetga chiqarish.\n\n💡 Maslahat: shoshilmang, har bir savolni diqqat bilan o'qing. Ishonchingiz komil bo'lmasa, darslardagi "Eslab qoling" qismlarini bir ko'zdan kechiring.` },
      { type: 'finalquiz', title: "Yakuniy imtihon",
        content: `20 ta savol: 15 ta belgilash (1 balldan) + 5 ta yozma (2 balldan). Jami 25 ball, o'tish uchun **18 ball** kerak.`,
        questions: [
          { question: "RTFC promptning to'liq tarkibi?", options: [ { text: "Role, Task, Format, Constraint", correct: true }, { text: "Read, Type, Find, Close", correct: false }, { text: "Run, Test, Fix, Compile", correct: false }, { text: "Hech qaysi", correct: false } ] },
          { question: "LLM asosan nima qiladi?", options: [ { text: "Keyingi tokenni bashorat qiladi", correct: true }, { text: "Internetdan nusxalaydi", correct: false }, { text: "Bazadan qidiradi", correct: false }, { text: "Rasm chizadi", correct: false } ] },
          { question: "Hallucination nima?", options: [ { text: "Ishonch bilan noto'g'ri javob to'qish", correct: true }, { text: "Sekin ishlash", correct: false }, { text: "Internet uzilishi", correct: false }, { text: "Token tugashi", correct: false } ] },
          { question: "Diffusion modeli rasmni qanday yasaydi?", options: [ { text: "Shovqindan tozalab", correct: true }, { text: "Nusxalab", correct: false }, { text: "Qo'lda", correct: false }, { text: "Bazadan", correct: false } ] },
          { question: "RAG nima beradi?", options: [ { text: "Tashqi bilimni kontekst sifatida qo'shadi", correct: true }, { text: "Modelni tezlashtiradi", correct: false }, { text: "Ovoz yaratadi", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Vibe coding nima?", options: [ { text: "Tabiiy til bilan dastur qurish", correct: true }, { text: "Qo'lda kod yozish", correct: false }, { text: "Video montaj", correct: false }, { text: "Ovoz yozish", correct: false } ] },
          { question: "Git nima uchun?", options: [ { text: "Versiya nazorati", correct: true }, { text: "Rasm chizish", correct: false }, { text: "Domen", correct: false }, { text: "Ovoz", correct: false } ] },
          { question: "REST API nima?", options: [ { text: "Dasturlar o'zaro gaplashadigan til", correct: true }, { text: "Rasm formati", correct: false }, { text: "Brauzer", correct: false }, { text: "Domen", correct: false } ] },
          { question: "ReAct nima?", options: [ { text: "Reasoning + Acting (agent sikli)", correct: true }, { text: "Read + Act", correct: false }, { text: "JS kutubxona", correct: false }, { text: "Rang", correct: false } ] },
          { question: "MCP nima beradi?", options: [ { text: "Agentga tool (funksiya)lar", correct: true }, { text: "Rang", correct: false }, { text: "Domen", correct: false }, { text: "Ovoz", correct: false } ] },
          { question: "Embedding nima qiladi?", options: [ { text: "Matnni vektorga aylantiradi", correct: true }, { text: "Rasmni siqadi", correct: false }, { text: "Domen oladi", correct: false }, { text: "Video qisqartiradi", correct: false } ] },
          { question: "STT (Whisper) nima qiladi?", options: [ { text: "Ovozni matnga aylantiradi", correct: true }, { text: "Matnni ovozga", correct: false }, { text: "Rasm yasaydi", correct: false }, { text: "Kod yozadi", correct: false } ] },
          { question: "Guardrail nima?", options: [ { text: "Botga himoya qoidasi/cheklovi", correct: true }, { text: "Yo'l to'sig'i", correct: false }, { text: "Rasm filtri", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Model-routing nima?", options: [ { text: "Vazifaga qarab arzon/qimmat model tanlash", correct: true }, { text: "Internet routeri", correct: false }, { text: "Rang", correct: false }, { text: "Domen", correct: false } ] },
          { question: "Deploy nima?", options: [ { text: "Loyihani serverga jonli chiqarish", correct: true }, { text: "Kodni o'chirish", correct: false }, { text: "Rasm yuklash", correct: false }, { text: "Parol", correct: false } ] },
          // ── YOZMA SAVOLLAR (2 ball) ──
          { type: 'text', question: "Prompt nima va yaxshi prompt qanday bo'lishi kerak?", keywords: ["ko'rsatma", "buyruq", "aniq", "kontekst", "rol", "format", "misal", "clear"], modelAnswer: "Prompt — AI ga beriladigan ko'rsatma. Yaxshi prompt: aniq maqsad, kerakli kontekst, model roli, javob formati va misollar bilan to'liq bo'lishi kerak." },
          { type: 'text', question: "RAG va oddiy AI chatbot o'rtasidagi asosiy farqni tushuntirib bering.", keywords: ["baza", "hujjat", "gallyutsinatsiya", "aniq", "kontekst", "yangi", "bilim", "tashqi"], modelAnswer: "Oddiy chatbot faqat o'qitilgan bilimidan javob beradi (eskirgan, gallyutsinatsiya mumkin). RAG esa tashqi hujjat bazasidan aniq, yangi ma'lumot olib javob beradi." },
          { type: 'text', question: "AI agent qurish uchun qanday qismlar kerak?", keywords: ["llm", "model", "tool", "mcp", "memory", "xotira", "qaror", "loop", "funksiya"], modelAnswer: "1) LLM (fikrlash), 2) Toollar (harakat qilish — qidiruv, API, hisoblash), 3) Xotira (kontekst saqlash), 4) Loop (maqsadga yetguncha takrorlash)." },
          { type: 'text', question: "Bu kurs orqali qanday loyiha qurish mumkin? O'zingizga mos misolni keltiring.", keywords: ["bot", "agent", "sayt", "rag", "api", "telegram", "sotuv", "ta'lim", "xizmat"], modelAnswer: "Masalan: onlayn do'kon uchun Telegram sotuv boti (RAG + AI agent + vibe coding bilan qurilgan sayt + Vercel deploy)." },
          { type: 'text', question: "Sun'iy Intelekt kursidan olgan eng muhim 3 ta bilimingizni yozing.", keywords: ["prompt", "bot", "rag", "agent", "vibe", "canva", "elevenlabs", "deploy", "github", "api", "multimodal"], modelAnswer: "Har qanday 3 ta relevant mavzu qabul qilinadi — muhimi o'quvchi kurs mazmunimdagi narsalarni eslashi va o'z so'zi bilan ifodalashi." },
        ] },
    ]
  },
];

// Ikkala kursni birlashtirib, har biriga course teglaymiz
export const lessons: Lesson[] = [
  ...aiEngLessons.map((l) => ({ ...l, course: 'ai-eng' as const })),
  ...promptEngLessons.map((l) => ({ ...l, course: 'prompt-eng' as const })),
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(l => l.id === id);
}

export function getLessonsByCourse(course: CourseId): Lesson[] {
  return lessons.filter(l => l.course === course);
}

export function getLessonsByTopic(phase: number, topic: number, course: CourseId = 'ai-eng'): Lesson[] {
  return lessons.filter(l => l.course === course && l.phase === phase && l.topic === topic);
}

export function getPrimaryLessonId(phaseNum: string, topicIdx: number, course: CourseId = 'ai-eng'): string | null {
  const phase = parseInt(phaseNum, 10);
  const match = getLessonsByTopic(phase, topicIdx, course)[0];
  return match?.id ?? null;
}

// Keyingi/oldingi dars — faqat shu darsning kursi ichida
export function getNextLessonId(currentId: string): string | null {
  const current = getLessonById(currentId);
  if (!current) return null;
  const courseLessons = getLessonsByCourse(current.course);
  const idx = courseLessons.findIndex(l => l.id === currentId);
  if (idx >= 0 && idx < courseLessons.length - 1) return courseLessons[idx + 1].id;
  return null;
}

export function getPrevLessonId(currentId: string): string | null {
  const current = getLessonById(currentId);
  if (!current) return null;
  const courseLessons = getLessonsByCourse(current.course);
  const idx = courseLessons.findIndex(l => l.id === currentId);
  if (idx > 0) return courseLessons[idx - 1].id;
  return null;
}
