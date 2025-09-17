export const translations = {
  en: {
    // Common UI
    buttons: {
      createGame: 'Create Game',
      joinGame: 'Join Game',
      startGame: 'Start Game',
      leaveGame: 'Leave Game',
      readyToPlay: 'Ready to Play',
      cancelReady: 'Cancel Ready',
      guess: 'Guess',
      continueDrawing: 'Continue Drawing Instead',
      mute: 'Mute',
      unmute: 'Unmute',
      restartGame: 'Restart Game',
      playAgain: 'Play Again',
      creating: 'Creating...',
      joining: 'Joining...'
    },
    
    // Form fields
    forms: {
      yourName: 'Your Name',
      enterName: 'Enter your name',
      gameId: 'Game ID',
      enterGameId: 'Enter game ID',
      nameRequired: 'Please enter your name',
      gameIdRequired: 'Please enter your name and game ID'
    },
    
    // Game states
    game: {
      gameId: 'Game ID',
      players: 'Players',
      rounds: 'Rounds',
      drawingTime: 'Drawing Time',
      guessingTime: 'Guessing Time',
      readyPlayers: 'Ready Players',
      ready: 'Ready',
      notReady: 'Not Ready',
      you: 'You',
      host: 'Host',
      gameSettings: 'Game Settings',
      leaderboard: 'Leaderboard',
      score: 'Score',
      points: 'points',
      point: 'point'
    },
    
    // Game phases
    phases: {
      drawingPhase: 'Drawing Phase',
      guessingPhase: 'Guessing Phase',
      drawYourWord: 'Draw your word in {timeRemaining} seconds',
      guessTheDrawing: 'Guess the Drawing!',
      guessDescription: 'Look at this drawing and try to guess what word it represents',
      allDrawingsProcessed: 'All drawings have been processed!',
      finalResults: 'Final Results!',
      roundComplete: 'Round Complete!',
      getReadyNextRound: 'Get ready for the next round...',
      roundSummary: 'Round Summary'
    },
    
    // Game messages
    messages: {
      waitingForPlayers: 'Waiting for other players...',
      waitingForResults: 'Waiting for results...',
      guessSubmitted: 'Guess submitted!',
      correct: 'Correct!',
      alreadyGuessed: 'Already Guessed',
      pointsEarned: '+1 point!',
      theWordWas: 'The word was: {word}',
      correctlyGuessed: '✓ Correctly guessed',
      notGuessedCorrectly: '✗ Not guessed correctly'
    },
    
    // How to play
    howToPlay: {
      title: 'How to Play',
      step1Title: '1. Drawing Phase ({time}s)',
      step1Description: 'Each player gets a secret word and draws it on the canvas.',
      step2Title: '2. Passing Drawings', 
      step2Description: 'Drawings rotate to the next player in the circle.',
      step3Title: '3. Guessing Phase ({time}s)',
      step3Description: 'Try to guess what the drawing represents, or continue drawing it.',
      step4Title: '4. Scoring',
      step4Description: 'Earn 1 point for each correct guess. Most points wins!'
    },
    
    // Game over
    gameOver: {
      title: '🎉 Game Over! 🎉',
      winner: '{name} wins with {score} points!'
    },
    
    // General
    general: {
      loading: 'Loading...',
      settingUpGame: 'Setting up the game...',
      word: 'Word:',
      error: 'Error: '
    },

    // Drawing words
    words: {
      // Animals
      'cat': 'cat',
      'dog': 'dog',
      'fish': 'fish',
      'bird': 'bird',
      'elephant': 'elephant',
      'lion': 'lion',
      'horse': 'horse',
      'cow': 'cow',
      'pig': 'pig',
      'rabbit': 'rabbit',
      // Food
      'pizza': 'pizza',
      'apple': 'apple',
      'banana': 'banana',
      'cake': 'cake',
      'bread': 'bread',
      'cheese': 'cheese',
      'ice cream': 'ice cream',
      // Objects
      'car': 'car',
      'house': 'house',
      'tree': 'tree',
      'flower': 'flower',
      'book': 'book',
      'chair': 'chair',
      'table': 'table',
      // Simple concepts
      'sun': 'sun',
      'moon': 'moon',
      'star': 'star',
      'happy': 'happy',
      'sad': 'sad'
    }
  },
  
  fr: {
    buttons: {
      createGame: 'Créer une partie',
      joinGame: 'Rejoindre',
      startGame: 'Démarrer',
      leaveGame: 'Quitter',
      readyToPlay: 'Prêt à jouer',
      cancelReady: 'Annuler',
      guess: 'Deviner',
      continueDrawing: 'Continuer à dessiner',
      mute: 'Muet',
      unmute: 'Son',
      restartGame: 'Redémarrer',
      playAgain: 'Rejouer',
      creating: 'Création...',
      joining: 'Connexion...'
    },
    
    forms: {
      yourName: 'Votre nom',
      enterName: 'Entrez votre nom',
      gameId: 'ID de la partie',
      enterGameId: 'Entrez l\'ID de la partie',
      nameRequired: 'Veuillez entrer votre nom',
      gameIdRequired: 'Veuillez entrer votre nom et l\'ID de la partie'
    },
    
    game: {
      gameId: 'ID de la partie',
      players: 'Joueurs',
      rounds: 'Manches',
      drawingTime: 'Temps de dessin',
      guessingTime: 'Temps de devinette',
      readyPlayers: 'Joueurs prêts',
      ready: 'Prêt',
      notReady: 'Pas prêt',
      you: 'Vous',
      host: 'Hôte',
      gameSettings: 'Paramètres',
      leaderboard: 'Classement',
      score: 'Score',
      points: 'points',
      point: 'point'
    },
    
    phases: {
      drawingPhase: 'Phase de dessin',
      guessingPhase: 'Phase de devinette',
      drawYourWord: 'Dessinez votre mot en {timeRemaining} secondes',
      guessTheDrawing: 'Devinez le dessin !',
      guessDescription: 'Regardez ce dessin et essayez de deviner quel mot il représente',
      allDrawingsProcessed: 'Tous les dessins ont été traités !',
      finalResults: 'Résultats finaux !',
      roundComplete: 'Manche terminée !',
      getReadyNextRound: 'Préparez-vous pour la prochaine manche...',
      roundSummary: 'Résumé de la manche'
    },
    
    messages: {
      waitingForPlayers: 'En attente des autres joueurs...',
      waitingForResults: 'En attente des résultats...',
      guessSubmitted: 'Proposition envoyée !',
      correct: 'Correct !',
      alreadyGuessed: 'Déjà deviné',
      pointsEarned: '+1 point !',
      theWordWas: 'Le mot était : {word}',
      correctlyGuessed: '✓ Correctement deviné',
      notGuessedCorrectly: '✗ Pas deviné correctement'
    },
    
    howToPlay: {
      title: 'Comment jouer',
      step1Title: '1. Phase de dessin ({time}s)',
      step1Description: 'Chaque joueur reçoit un mot secret et le dessine sur la toile.',
      step2Title: '2. Passage des dessins',
      step2Description: 'Les dessins passent au joueur suivant dans le cercle.',
      step3Title: '3. Phase de devinette ({time}s)',
      step3Description: 'Essayez de deviner ce que représente le dessin ou continuez à le dessiner.',
      step4Title: '4. Score',
      step4Description: 'Gagnez 1 point pour chaque bonne réponse. Celui qui a le plus de points gagne !'
    },
    
    gameOver: {
      title: '🎉 Jeu terminé ! 🎉',
      winner: '{name} gagne avec {score} points !'
    },
    
    general: {
      loading: 'Chargement...',
      settingUpGame: 'Configuration de la partie...',
      word: 'Mot :',
      error: 'Erreur : '
    },

    // Drawing words in French
    words: {
      // Animals
      'cat': 'chat',
      'dog': 'chien',
      'fish': 'poisson',
      'bird': 'oiseau',
      'elephant': 'éléphant',
      'lion': 'lion',
      'horse': 'cheval',
      'cow': 'vache',
      'pig': 'cochon',
      'rabbit': 'lapin',
      // Food
      'pizza': 'pizza',
      'apple': 'pomme',
      'banana': 'banane',
      'cake': 'gâteau',
      'bread': 'pain',
      'cheese': 'fromage',
      'ice cream': 'glace',
      // Objects
      'car': 'voiture',
      'house': 'maison',
      'tree': 'arbre',
      'flower': 'fleur',
      'book': 'livre',
      'chair': 'chaise',
      'table': 'table',
      // Simple concepts
      'sun': 'soleil',
      'moon': 'lune',
      'star': 'étoile',
      'happy': 'heureux',
      'sad': 'triste'
    }
  },
  
  es: {
    buttons: {
      createGame: 'Crear partida',
      joinGame: 'Unirse',
      startGame: 'Empezar',
      leaveGame: 'Salir',
      readyToPlay: 'Listo para jugar',
      cancelReady: 'Cancelar',
      guess: 'Adivinar',
      continueDrawing: 'Seguir dibujando',
      mute: 'Silenciar',
      unmute: 'Sonido',
      restartGame: 'Reiniciar',
      playAgain: 'Jugar otra vez',
      creating: 'Creando...',
      joining: 'Uniéndose...'
    },
    
    forms: {
      yourName: 'Tu nombre',
      enterName: 'Ingresa tu nombre',
      gameId: 'ID del juego',
      enterGameId: 'Ingresa el ID del juego',
      nameRequired: 'Por favor ingresa tu nombre',
      gameIdRequired: 'Por favor ingresa tu nombre y el ID del juego'
    },
    
    game: {
      gameId: 'ID del juego',
      players: 'Jugadores',
      rounds: 'Rondas',
      drawingTime: 'Tiempo de dibujo',
      guessingTime: 'Tiempo de adivinanza',
      readyPlayers: 'Jugadores listos',
      ready: 'Listo',
      notReady: 'No listo',
      you: 'Tú',
      host: 'Anfitrión',
      gameSettings: 'Configuración',
      leaderboard: 'Tabla de posiciones',
      score: 'Puntuación',
      points: 'puntos',
      point: 'punto'
    },
    
    phases: {
      drawingPhase: 'Fase de dibujo',
      guessingPhase: 'Fase de adivinanza',
      drawYourWord: 'Dibuja tu palabra en {timeRemaining} segundos',
      guessTheDrawing: '¡Adivina el dibujo!',
      guessDescription: 'Mira este dibujo e intenta adivinar qué palabra representa',
      allDrawingsProcessed: '¡Todos los dibujos han sido procesados!',
      finalResults: '¡Resultados finales!',
      roundComplete: '¡Ronda completa!',
      getReadyNextRound: 'Prepárate para la siguiente ronda...',
      roundSummary: 'Resumen de la ronda'
    },
    
    messages: {
      waitingForPlayers: 'Esperando a otros jugadores...',
      waitingForResults: 'Esperando resultados...',
      guessSubmitted: '¡Adivinanza enviada!',
      correct: '¡Correcto!',
      alreadyGuessed: 'Ya adivinado',
      pointsEarned: '¡+1 punto!',
      theWordWas: 'La palabra era: {word}',
      correctlyGuessed: '✓ Adivinado correctamente',
      notGuessedCorrectly: '✗ No adivinado correctamente'
    },
    
    howToPlay: {
      title: 'Cómo jugar',
      step1Title: '1. Fase de dibujo ({time}s)',
      step1Description: 'Cada jugador recibe una palabra secreta y la dibuja en el lienzo.',
      step2Title: '2. Pasando dibujos',
      step2Description: 'Los dibujos rotan al siguiente jugador en el círculo.',
      step3Title: '3. Fase de adivinanza ({time}s)',
      step3Description: 'Intenta adivinar qué representa el dibujo o continúa dibujándolo.',
      step4Title: '4. Puntuación',
      step4Description: '¡Gana 1 punto por cada adivinanza correcta. El que tenga más puntos gana!'
    },
    
    gameOver: {
      title: '🎉 ¡Juego terminado! 🎉',
      winner: '¡{name} gana con {score} puntos!'
    },
    
    general: {
      loading: 'Cargando...',
      settingUpGame: 'Configurando el juego...',
      word: 'Palabra:',
      error: 'Error: '
    },

    // Drawing words in Spanish
    words: {
      // Animals
      'cat': 'gato',
      'dog': 'perro', 
      'fish': 'pez',
      'bird': 'pájaro',
      'elephant': 'elefante',
      'lion': 'león',
      'horse': 'caballo',
      'cow': 'vaca',
      'pig': 'cerdo',
      'rabbit': 'conejo',
      // Food
      'pizza': 'pizza',
      'apple': 'manzana',
      'banana': 'banana',
      'cake': 'pastel',
      'bread': 'pan',
      'cheese': 'queso',
      'ice cream': 'helado',
      // Objects  
      'car': 'coche',
      'house': 'casa',
      'tree': 'árbol',
      'flower': 'flor',
      'book': 'libro',
      'chair': 'silla',
      'table': 'mesa',
      // Simple concepts
      'sun': 'sol',
      'moon': 'luna',
      'star': 'estrella',
      'happy': 'feliz',
      'sad': 'triste'
    }
  },
  
  it: {
    buttons: {
      createGame: 'Crea partita',
      joinGame: 'Unisciti',
      startGame: 'Inizia',
      leaveGame: 'Esci',
      readyToPlay: 'Pronto a giocare',
      cancelReady: 'Annulla',
      guess: 'Indovina',
      continueDrawing: 'Continua a disegnare',
      mute: 'Muto',
      unmute: 'Suono',
      restartGame: 'Riavvia',
      playAgain: 'Gioca ancora',
      creating: 'Creando...',
      joining: 'Unendosi...'
    },
    
    forms: {
      yourName: 'Il tuo nome',
      enterName: 'Inserisci il tuo nome',
      gameId: 'ID del gioco',
      enterGameId: 'Inserisci l\'ID del gioco',
      nameRequired: 'Per favore inserisci il tuo nome',
      gameIdRequired: 'Per favore inserisci il tuo nome e l\'ID del gioco'
    },
    
    game: {
      gameId: 'ID del gioco',
      players: 'Giocatori',
      rounds: 'Round',
      drawingTime: 'Tempo di disegno',
      guessingTime: 'Tempo di indovinello',
      readyPlayers: 'Giocatori pronti',
      ready: 'Pronto',
      notReady: 'Non pronto',
      you: 'Tu',
      host: 'Host',
      gameSettings: 'Impostazioni',
      leaderboard: 'Classifica',
      score: 'Punteggio',
      points: 'punti',
      point: 'punto'
    },
    
    phases: {
      drawingPhase: 'Fase di disegno',
      guessingPhase: 'Fase di indovinello',
      drawYourWord: 'Disegna la tua parola in {timeRemaining} secondi',
      guessTheDrawing: 'Indovina il disegno!',
      guessDescription: 'Guarda questo disegno e cerca di indovinare quale parola rappresenta',
      allDrawingsProcessed: 'Tutti i disegni sono stati elaborati!',
      finalResults: 'Risultati finali!',
      roundComplete: 'Round completato!',
      getReadyNextRound: 'Preparati per il prossimo round...',
      roundSummary: 'Riassunto del round'
    },
    
    messages: {
      waitingForPlayers: 'Aspettando altri giocatori...',
      waitingForResults: 'Aspettando i risultati...',
      guessSubmitted: 'Indovinello inviato!',
      correct: 'Corretto!',
      alreadyGuessed: 'Già indovinato',
      pointsEarned: '+1 punto!',
      theWordWas: 'La parola era: {word}',
      correctlyGuessed: '✓ Indovinato correttamente',
      notGuessedCorrectly: '✗ Non indovinato correttamente'
    },
    
    howToPlay: {
      title: 'Come giocare',
      step1Title: '1. Fase di disegno ({time}s)',
      step1Description: 'Ogni giocatore riceve una parola segreta e la disegna sulla tela.',
      step2Title: '2. Passaggio dei disegni',
      step2Description: 'I disegni ruotano al giocatore successivo nel cerchio.',
      step3Title: '3. Fase di indovinello ({time}s)',
      step3Description: 'Cerca di indovinare cosa rappresenta il disegno o continua a disegnarlo.',
      step4Title: '4. Punteggio',
      step4Description: 'Guadagna 1 punto per ogni indovinello corretto. Chi ha più punti vince!'
    },
    
    gameOver: {
      title: '🎉 Gioco finito! 🎉',
      winner: '{name} vince con {score} punti!'
    },
    
    general: {
      loading: 'Caricamento...',
      settingUpGame: 'Configurazione del gioco...',
      word: 'Parola:',
      error: 'Errore: '
    }
  },
  
  zh: {
    buttons: {
      createGame: '创建游戏',
      joinGame: '加入游戏',
      startGame: '开始游戏',
      leaveGame: '离开游戏',
      readyToPlay: '准备游戏',
      cancelReady: '取消准备',
      guess: '猜测',
      continueDrawing: '继续画画',
      mute: '静音',
      unmute: '取消静音',
      restartGame: '重新开始',
      playAgain: '再玩一次',
      creating: '创建中...',
      joining: '加入中...'
    },
    
    forms: {
      yourName: '你的名字',
      enterName: '输入你的名字',
      gameId: '游戏ID',
      enterGameId: '输入游戏ID',
      nameRequired: '请输入你的名字',
      gameIdRequired: '请输入你的名字和游戏ID'
    },
    
    game: {
      gameId: '游戏ID',
      players: '玩家',
      rounds: '回合',
      drawingTime: '绘画时间',
      guessingTime: '猜测时间',
      readyPlayers: '准备的玩家',
      ready: '准备',
      notReady: '未准备',
      you: '你',
      host: '主持人',
      gameSettings: '游戏设置',
      leaderboard: '排行榜',
      score: '分数',
      points: '分',
      point: '分'
    },
    
    phases: {
      drawingPhase: '绘画阶段',
      guessingPhase: '猜测阶段',
      drawYourWord: '在{timeRemaining}秒内画出你的词',
      guessTheDrawing: '猜测这幅画！',
      guessDescription: '看这幅画，试着猜猜它代表什么词',
      allDrawingsProcessed: '所有画作已处理完毕！',
      finalResults: '最终结果！',
      roundComplete: '回合完成！',
      getReadyNextRound: '准备下一回合...',
      roundSummary: '回合总结'
    },
    
    messages: {
      waitingForPlayers: '等待其他玩家...',
      waitingForResults: '等待结果...',
      guessSubmitted: '猜测已提交！',
      correct: '正确！',
      alreadyGuessed: '已经猜过了',
      pointsEarned: '+1分！',
      theWordWas: '这个词是：{word}',
      correctlyGuessed: '✓ 猜对了',
      notGuessedCorrectly: '✗ 没有猜对'
    },
    
    howToPlay: {
      title: '游戏规则',
      step1Title: '1. 绘画阶段（{time}秒）',
      step1Description: '每个玩家得到一个秘密词汇并在画布上画出来。',
      step2Title: '2. 传递画作',
      step2Description: '画作轮流传给圈子里的下一个玩家。',
      step3Title: '3. 猜测阶段（{time}秒）',
      step3Description: '试着猜测画作代表什么，或者继续画它。',
      step4Title: '4. 计分',
      step4Description: '每个正确答案得1分。得分最高者获胜！'
    },
    
    gameOver: {
      title: '🎉 游戏结束！🎉',
      winner: '{name}以{score}分获胜！'
    },
    
    general: {
      loading: '加载中...',
      settingUpGame: '设置游戏中...',
      word: '词汇：',
      error: '错误：'
    }
  },
  
  ar: {
    buttons: {
      createGame: 'إنشاء لعبة',
      joinGame: 'انضمام',
      startGame: 'بدء اللعبة',
      leaveGame: 'مغادرة',
      readyToPlay: 'جاهز للعب',
      cancelReady: 'إلغاء',
      guess: 'تخمين',
      continueDrawing: 'متابعة الرسم',
      mute: 'كتم الصوت',
      unmute: 'إلغاء الكتم',
      restartGame: 'إعادة تشغيل',
      playAgain: 'اللعب مرة أخرى',
      creating: 'جاري الإنشاء...',
      joining: 'جاري الانضمام...'
    },
    
    forms: {
      yourName: 'اسمك',
      enterName: 'أدخل اسمك',
      gameId: 'معرف اللعبة',
      enterGameId: 'أدخل معرف اللعبة',
      nameRequired: 'يرجى إدخال اسمك',
      gameIdRequired: 'يرجى إدخال اسمك ومعرف اللعبة'
    },
    
    game: {
      gameId: 'معرف اللعبة',
      players: 'اللاعبون',
      rounds: 'الجولات',
      drawingTime: 'وقت الرسم',
      guessingTime: 'وقت التخمين',
      readyPlayers: 'اللاعبون الجاهزون',
      ready: 'جاهز',
      notReady: 'غير جاهز',
      you: 'أنت',
      host: 'المضيف',
      gameSettings: 'إعدادات اللعبة',
      leaderboard: 'قائمة المتصدرين',
      score: 'النقاط',
      points: 'نقطة',
      point: 'نقطة'
    },
    
    phases: {
      drawingPhase: 'مرحلة الرسم',
      guessingPhase: 'مرحلة التخمين',
      drawYourWord: 'ارسم كلمتك في {timeRemaining} ثانية',
      guessTheDrawing: 'خمن الرسم!',
      guessDescription: 'انظر إلى هذا الرسم وحاول تخمين الكلمة التي يمثلها',
      allDrawingsProcessed: 'تم معالجة جميع الرسوم!',
      finalResults: 'النتائج النهائية!',
      roundComplete: 'اكتملت الجولة!',
      getReadyNextRound: 'استعد للجولة التالية...',
      roundSummary: 'ملخص الجولة'
    },
    
    messages: {
      waitingForPlayers: 'في انتظار اللاعبين الآخرين...',
      waitingForResults: 'في انتظار النتائج...',
      guessSubmitted: 'تم إرسال التخمين!',
      correct: 'صحيح!',
      alreadyGuessed: 'تم التخمين بالفعل',
      pointsEarned: '+1 نقطة!',
      theWordWas: 'كانت الكلمة: {word}',
      correctlyGuessed: '✓ تم التخمين بشكل صحيح',
      notGuessedCorrectly: '✗ لم يتم التخمين بشكل صحيح'
    },
    
    howToPlay: {
      title: 'كيفية اللعب',
      step1Title: '1. مرحلة الرسم ({time}ث)',
      step1Description: 'يحصل كل لاعب على كلمة سرية ويرسمها على اللوحة.',
      step2Title: '2. تمرير الرسوم',
      step2Description: 'تدور الرسوم إلى اللاعب التالي في الدائرة.',
      step3Title: '3. مرحلة التخمين ({time}ث)',
      step3Description: 'حاول تخمين ما يمثله الرسم أو تابع رسمه.',
      step4Title: '4. النقاط',
      step4Description: 'احصل على نقطة واحدة لكل تخمين صحيح. صاحب أكثر النقاط يفوز!'
    },
    
    gameOver: {
      title: '🎉 انتهت اللعبة! 🎉',
      winner: '{name} يفوز بـ {score} نقطة!'
    },
    
    general: {
      loading: 'جاري التحميل...',
      settingUpGame: 'جاري إعداد اللعبة...',
      word: 'الكلمة:',
      error: 'خطأ: '
    }
  },
  
  ru: {
    buttons: {
      createGame: 'Создать игру',
      joinGame: 'Присоединиться',
      startGame: 'Начать игру',
      leaveGame: 'Покинуть',
      readyToPlay: 'Готов играть',
      cancelReady: 'Отменить',
      guess: 'Угадать',
      continueDrawing: 'Продолжить рисование',
      mute: 'Выключить звук',
      unmute: 'Включить звук',
      restartGame: 'Перезапустить',
      playAgain: 'Играть снова',
      creating: 'Создание...',
      joining: 'Подключение...'
    },
    
    forms: {
      yourName: 'Ваше имя',
      enterName: 'Введите ваше имя',
      gameId: 'ID игры',
      enterGameId: 'Введите ID игры',
      nameRequired: 'Пожалуйста, введите ваше имя',
      gameIdRequired: 'Пожалуйста, введите ваше имя и ID игры'
    },
    
    game: {
      gameId: 'ID игры',
      players: 'Игроки',
      rounds: 'Раунды',
      drawingTime: 'Время рисования',
      guessingTime: 'Время угадывания',
      readyPlayers: 'Готовые игроки',
      ready: 'Готов',
      notReady: 'Не готов',
      you: 'Вы',
      host: 'Ведущий',
      gameSettings: 'Настройки игры',
      leaderboard: 'Таблица лидеров',
      score: 'Счёт',
      points: 'очков',
      point: 'очко'
    },
    
    phases: {
      drawingPhase: 'Фаза рисования',
      guessingPhase: 'Фаза угадывания',
      drawYourWord: 'Нарисуйте ваше слово за {timeRemaining} секунд',
      guessTheDrawing: 'Угадайте рисунок!',
      guessDescription: 'Посмотрите на этот рисунок и попытайтесь угадать, какое слово он представляет',
      allDrawingsProcessed: 'Все рисунки обработаны!',
      finalResults: 'Финальные результаты!',
      roundComplete: 'Раунд завершён!',
      getReadyNextRound: 'Приготовьтесь к следующему раунду...',
      roundSummary: 'Итоги раунда'
    },
    
    messages: {
      waitingForPlayers: 'Ожидание других игроков...',
      waitingForResults: 'Ожидание результатов...',
      guessSubmitted: 'Ответ отправлен!',
      correct: 'Правильно!',
      alreadyGuessed: 'Уже угадано',
      pointsEarned: '+1 очко!',
      theWordWas: 'Слово было: {word}',
      correctlyGuessed: '✓ Угадано правильно',
      notGuessedCorrectly: '✗ Не угадано правильно'
    },
    
    howToPlay: {
      title: 'Как играть',
      step1Title: '1. Фаза рисования ({time}с)',
      step1Description: 'Каждый игрок получает секретное слово и рисует его на холсте.',
      step2Title: '2. Передача рисунков',
      step2Description: 'Рисунки переходят к следующему игроку по кругу.',
      step3Title: '3. Фаза угадывания ({time}с)',
      step3Description: 'Попытайтесь угадать, что представляет рисунок, или продолжите его рисовать.',
      step4Title: '4. Подсчёт очков',
      step4Description: 'Получайте 1 очко за каждый правильный ответ. Больше всех очков - побеждает!'
    },
    
    gameOver: {
      title: '🎉 Игра окончена! 🎉',
      winner: '{name} побеждает с {score} очками!'
    },
    
    general: {
      loading: 'Загрузка...',
      settingUpGame: 'Настройка игры...',
      word: 'Слово:',
      error: 'Ошибка: '
    }
  }
};