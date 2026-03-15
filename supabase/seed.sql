-- Seed vocabulary
insert into vocabulary (german, english, example) values
  ('die Freiheit',      'freedom',        'Die Freiheit ist ein hohes Gut.'),
  ('die Entscheidung',  'decision',       'Ich muss eine schwierige Entscheidung treffen.'),
  ('die Verantwortung', 'responsibility', 'Jeder trägt Verantwortung für sein Handeln.'),
  ('der Eindruck',      'impression',     'Dein Vortrag hat einen guten Eindruck hinterlassen.'),
  ('die Erfahrung',     'experience',     'In diesem Job sammelte er wertvolle Erfahrungen.'),
  ('die Fähigkeit',     'ability',        'Jeder Mensch hat einzigartige Fähigkeiten.'),
  ('die Beziehung',     'relationship',   'Sie führen eine glückliche Beziehung.'),
  ('die Bedeutung',     'meaning',        'Ich verstehe die Bedeutung deiner Worte.'),
  ('der Zweck',         'purpose',        'Der Zweck heiligt nicht immer die Mittel.'),
  ('die Meinung',       'opinion',        'Jeder hat ein Recht auf seine eigene Meinung.')
on conflict do nothing;
