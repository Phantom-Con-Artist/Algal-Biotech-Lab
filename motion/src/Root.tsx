import React from 'react';
import { Composition } from 'remotion';
import { W, H } from './kit';
import { Transcription } from './scenes/Transcription';
import { Stress } from './scenes/Stress';
import { Carbon } from './scenes/Carbon';
import { Phosphate } from './scenes/Phosphate';
import { Biofuel } from './scenes/Biofuel';
import { Bioactives } from './scenes/Bioactives';
import { Reel, REEL_FRAMES } from './Reel';
import { Card, CARDS, CARD_FRAMES } from './Card';
import { Edit, INTRO, CARD_EDITS, total } from './Cut';
import { LabFilm, LAB_SCENES, labTotal } from './LabFilm';
import { LabAura, AURA_FRAMES } from './LabAura';

/** One clip per research programme; ids match the site's programme ids. */
const CLIPS = [
  { id: 'transcriptional-engineering', component: Transcription },
  { id: 'stress-biology', component: Stress },
  { id: 'carbon-concentrating', component: Carbon },
  { id: 'polyphosphate', component: Phosphate },
  { id: 'biofuels', component: Biofuel },
  { id: 'bioactives-bioeconomy', component: Bioactives },
];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="hero-reel" component={Reel} durationInFrames={REEL_FRAMES} fps={30} width={1600} height={900} />
    {CARDS.map(({ id, ...props }) => (
      <Composition key={id} id={id} component={Card} defaultProps={props} durationInFrames={CARD_FRAMES} fps={30} width={540} height={720} />
    ))}
    <Composition id="intro" component={Edit} defaultProps={{ shots: INTRO, vignette: 0.45 }} durationInFrames={total(INTRO)} fps={30} width={1280} height={720} />
    <Composition id="lab-aura" component={LabAura} durationInFrames={AURA_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="lab-film" component={LabFilm} defaultProps={{ scenes: LAB_SCENES }} durationInFrames={labTotal(LAB_SCENES)} fps={30} width={1280} height={720} />
    {CARD_EDITS.map((c) => (
      <Composition key={c.id} id={`cut-${c.id}`} component={Edit} defaultProps={{ shots: c.shots }} durationInFrames={total(c.shots)} fps={30} width={540} height={720} />
    ))}
    {CLIPS.map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={250} fps={30} width={W} height={H} />
    ))}
  </>
);
