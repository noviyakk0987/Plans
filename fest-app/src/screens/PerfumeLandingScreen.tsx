import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../theme';
import { FadeIn, Pressable, Tilt } from '../motion';

const NOTES = [
  { title: 'верхние ноты', value: 'чёрный инжир · холодный бергамот' },
  { title: 'сердце', value: 'ирис · неоновая фиалка · дым ладана' },
  { title: 'шлейф', value: 'амброксан · кожа · тёплый мускус' },
];

const RITUALS = ['01 распылить в воздух', '02 войти в облако', '03 исчезнуть красиво'];

export const PerfumeLandingScreen = () => {
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const drift = useSharedValue(0);
  const isWide = width >= 900;

  React.useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: 9000 }), -1, true);
  }, []);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const bottleFloat = useAnimatedStyle(() => {
    const y = interpolate(drift.value, [0, 1], [-12, 16], Extrapolation.CLAMP);
    const rotate = interpolate(drift.value, [0, 1], [-7, 8], Extrapolation.CLAMP);
    const parallax = interpolate(scrollY.value, [0, 500], [0, 54], Extrapolation.CLAMP);
    return {
      transform: [
        { perspective: 1100 },
        { translateY: y + parallax },
        { rotateX: '-10deg' },
        { rotateY: `${rotate}deg` },
        { rotateZ: '-2deg' },
      ],
    };
  });

  const haloStyle = useAnimatedStyle(() => {
    const scale = interpolate(drift.value, [0, 1], [0.94, 1.08], Extrapolation.CLAMP);
    const opacity = interpolate(drift.value, [0, 1], [0.44, 0.72], Extrapolation.CLAMP);
    return { opacity, transform: [{ scale }] };
  });

  const headlineStyle = useAnimatedStyle(() => {
    const y = interpolate(scrollY.value, [0, 280], [0, -38], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, 260], [1, 0.48], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY: y }] };
  });

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <View pointerEvents="none" style={s.backdrop}>
        <Animated.View style={[s.halo, haloStyle]} />
        <View style={s.orbRose} />
        <View style={s.orbGold} />
        <View style={s.grid} />
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        <View style={s.nav}>
          <Text style={s.logo}>NÉBULE</Text>
          <View style={s.navLinks}>
            <Text style={s.navLink}>аромат</Text>
            <Text style={s.navLink}>ритуал</Text>
            <Text style={s.navLink}>бутик</Text>
          </View>
        </View>

        <View style={[s.hero, isWide && s.heroWide]}>
          <Animated.View style={[s.copy, headlineStyle]}>
            <FadeIn direction="up" distance={16} delay={80}>
              <Text style={s.kicker}>не существующий бренд духов · extrait 03</Text>
            </FadeIn>
            <FadeIn direction="up" distance={22} delay={160}>
              <Text style={s.title}>Запах, который выглядит как сон.</Text>
            </FadeIn>
            <FadeIn direction="up" distance={18} delay={280}>
              <Text style={s.subtitle}>
                Maison Nébule собирает инжир, ирис и тёплый мускус в тёмный 3D-флакон. Сайт дышит,
                стекло парит, бренд — полностью выдуман. Почти неприлично убедительно.
              </Text>
            </FadeIn>
            <FadeIn direction="up" distance={12} delay={400}>
              <View style={s.ctaRow}>
                <Pressable style={s.primaryCta} activeScale={0.96}>
                  <Text style={s.primaryText}>Открыть аромат</Text>
                </Pressable>
                <Text style={s.price}>₽ 18 900 · 50 мл</Text>
              </View>
            </FadeIn>
          </Animated.View>

          <View style={s.stage}>
            <Animated.View style={[s.bottleWrap, bottleFloat]}>
              <PerfumeBottle />
            </Animated.View>
            <View style={s.shadow} />
            <View style={s.glowRing} />
          </View>
        </View>

        <View style={s.marquee}>
          <Text style={s.marqueeText}>FIG NOIR</Text>
          <Text style={s.marqueeTextMuted}>IRIS VAPEUR</Text>
          <Text style={s.marqueeText}>AMBRE FANTÔME</Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionEyebrow}>пирамида аромата</Text>
          <Text style={s.sectionTitle}>Три слоя, одно наваждение.</Text>
          <View style={s.noteGrid}>
            {NOTES.map((note, index) => (
              <FadeIn key={note.title} delay={80 + index * 90} direction="up" distance={14}>
                <Tilt style={s.noteCard} maxTilt={10} liftOnHover={10}>
                  <Text style={s.noteIndex}>0{index + 1}</Text>
                  <Text style={s.noteTitle}>{note.title}</Text>
                  <Text style={s.noteValue}>{note.value}</Text>
                </Tilt>
              </FadeIn>
            ))}
          </View>
        </View>

        <View style={[s.section, s.ritualSection]}>
          <View style={s.ritualCopy}>
            <Text style={s.sectionEyebrow}>ритуал исчезновения</Text>
            <Text style={s.sectionTitle}>Наносится как спецэффект.</Text>
          </View>
          <View style={s.ritualList}>
            {RITUALS.map((item) => (
              <View key={item} style={s.ritualItem}>
                <Text style={s.ritualText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.finalCard}>
          <Text style={s.finalTitle}>Maison Nébule</Text>
          <Text style={s.finalText}>Вымышленный флакон. Реальный вау-эффект.</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const PerfumeBottle = () => (
  <View style={s.bottle}>
    <View style={s.capTop} />
    <View style={s.cap}>
      <View style={s.capShine} />
    </View>
    <View style={s.neck} />
    <View style={s.glass}>
      <View style={s.innerGlow} />
      <View style={s.liquid} />
      <View style={s.labelPlate}>
        <Text style={s.labelSmall}>MAISON</Text>
        <Text style={s.labelBig}>NÉBULE</Text>
        <Text style={s.labelSmall}>FIG NOIR · 03</Text>
      </View>
      <View style={s.sideHighlight} />
      <View style={s.sideShadow} />
      <View style={s.glassEdge} />
    </View>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09070F' },
  backdrop: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', backgroundColor: '#09070F' },
  halo: {
    position: 'absolute',
    width: 760,
    height: 760,
    borderRadius: 999,
    top: -170,
    right: -190,
    backgroundColor: 'rgba(159, 91, 255, 0.34)',
    ...Platform.select({ web: { filter: 'blur(90px)' } as any }),
  },
  orbRose: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 999,
    left: -120,
    top: 160,
    backgroundColor: 'rgba(255, 68, 139, 0.22)',
    ...Platform.select({ web: { filter: 'blur(74px)' } as any }),
  },
  orbGold: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 999,
    right: 80,
    bottom: 260,
    backgroundColor: 'rgba(240, 191, 110, 0.18)',
    ...Platform.select({ web: { filter: 'blur(82px)' } as any }),
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
    ...Platform.select({
      web: {
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(circle at 60% 20%, black, transparent 70%)',
      } as any,
    }),
  },
  scrollContent: {
    minHeight: '100%',
    paddingHorizontal: Platform.select({ web: 44, default: theme.spacing.lg }),
    paddingBottom: 60,
  },
  nav: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingTop: Platform.select({ web: 28, default: 54 }),
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { fontFamily: theme.fonts.display, color: '#FFF7E8', letterSpacing: 6, fontSize: 18 },
  navLinks: { flexDirection: 'row', gap: 18 },
  navLink: { color: 'rgba(255, 247, 232, 0.66)', fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase' },
  hero: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingTop: 32, gap: 28 },
  heroWide: { minHeight: 690, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  copy: { flex: 1, maxWidth: 650, zIndex: 2 },
  kicker: { color: '#E8C488', fontSize: 12, letterSpacing: 3.2, textTransform: 'uppercase', marginBottom: 16 },
  title: {
    fontFamily: theme.fonts.display,
    color: '#FFF7E8',
    fontSize: Platform.select({ web: 72, default: 42 }),
    lineHeight: Platform.select({ web: 78, default: 48 }),
    letterSpacing: -2.4,
    maxWidth: 760,
  },
  subtitle: {
    color: 'rgba(255, 247, 232, 0.72)',
    fontSize: Platform.select({ web: 18, default: 15 }),
    lineHeight: Platform.select({ web: 29, default: 23 }),
    maxWidth: 590,
    marginTop: 22,
  },
  ctaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 30 },
  primaryCta: {
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 999,
    backgroundColor: '#FFF7E8',
    ...Platform.select({ web: { boxShadow: '0 22px 70px rgba(255, 247, 232, .18)' } as any }),
  },
  primaryText: { color: '#100A16', fontWeight: '800', fontSize: 14, letterSpacing: 0.4 },
  price: { color: 'rgba(255, 247, 232, 0.58)', fontSize: 14, letterSpacing: 1.4 },
  stage: {
    flex: 1,
    minHeight: Platform.select({ web: 620, default: 500 }),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleWrap: { zIndex: 3 },
  bottle: { width: 270, height: 470, alignItems: 'center' },
  capTop: {
    width: 128,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#2B2035',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    zIndex: 5,
  },
  cap: {
    width: 108,
    height: 92,
    marginTop: -4,
    borderRadius: 22,
    backgroundColor: '#17101F',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
    transform: [{ perspective: 700 }, { rotateX: '8deg' }],
  },
  capShine: { width: 24, height: 110, backgroundColor: 'rgba(255,255,255,0.16)', marginLeft: 18, transform: [{ rotateZ: '12deg' }] },
  neck: {
    width: 74,
    height: 48,
    marginTop: -1,
    backgroundColor: 'rgba(255, 247, 232, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    zIndex: 4,
  },
  glass: {
    width: 238,
    height: 315,
    marginTop: -2,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.34)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { boxShadow: 'inset -32px 0 80px rgba(255,255,255,.08), inset 32px 0 70px rgba(0,0,0,.28)' } as any }),
  },
  innerGlow: {
    position: 'absolute',
    width: 210,
    height: 260,
    borderRadius: 44,
    backgroundColor: 'rgba(156, 79, 255, 0.24)',
    ...Platform.select({ web: { filter: 'blur(28px)' } as any }),
  },
  liquid: {
    position: 'absolute',
    bottom: 0,
    width: '120%',
    height: 132,
    backgroundColor: 'rgba(103, 29, 83, 0.78)',
    borderTopLeftRadius: 90,
    borderTopRightRadius: 130,
  },
  labelPlate: {
    width: 152,
    height: 122,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 232, 188, 0.5)',
    backgroundColor: 'rgba(11, 7, 18, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  labelSmall: { color: 'rgba(255, 232, 188, 0.72)', fontSize: 9, letterSpacing: 2.2 },
  labelBig: { fontFamily: theme.fonts.display, color: '#FFF7E8', fontSize: 23, letterSpacing: 2, marginVertical: 8 },
  sideHighlight: { position: 'absolute', left: 24, top: 20, width: 26, height: 250, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)' },
  sideShadow: { position: 'absolute', right: 0, top: 0, width: 72, height: '100%', backgroundColor: 'rgba(0,0,0,0.2)' },
  glassEdge: { position: 'absolute', inset: 10, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' } as any,
  shadow: {
    position: 'absolute',
    bottom: 68,
    width: 330,
    height: 58,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.58)',
    transform: [{ scaleX: 1.2 }],
    ...Platform.select({ web: { filter: 'blur(18px)' } as any }),
  },
  glowRing: {
    position: 'absolute',
    width: 430,
    height: 430,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(232,196,136,0.18)',
    transform: [{ rotateX: '68deg' }, { rotateZ: '-12deg' }],
  },
  marquee: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingVertical: 22,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 247, 232, 0.13)',
  },
  marqueeText: { fontFamily: theme.fonts.display, color: '#FFF7E8', fontSize: Platform.select({ web: 28, default: 19 }), letterSpacing: 2 },
  marqueeTextMuted: { fontFamily: theme.fonts.display, color: 'rgba(255, 247, 232, 0.28)', fontSize: Platform.select({ web: 28, default: 19 }), letterSpacing: 2 },
  section: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingTop: Platform.select({ web: 96, default: 56 }) },
  sectionEyebrow: { color: '#E8C488', fontSize: 12, letterSpacing: 3.2, textTransform: 'uppercase', marginBottom: 12 },
  sectionTitle: { fontFamily: theme.fonts.display, color: '#FFF7E8', fontSize: Platform.select({ web: 46, default: 30 }), lineHeight: Platform.select({ web: 54, default: 37 }), maxWidth: 620 },
  noteGrid: { marginTop: 34, flexDirection: Platform.select({ web: 'row', default: 'column' }), gap: 18 },
  noteCard: {
    flex: 1,
    minHeight: 220,
    borderRadius: 34,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.075)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'space-between',
    ...Platform.select({ web: { backdropFilter: 'blur(18px)', boxShadow: '0 28px 80px rgba(0,0,0,.22)' } as any }),
  },
  noteIndex: { color: 'rgba(255, 247, 232, 0.28)', fontFamily: theme.fonts.display, fontSize: 38 },
  noteTitle: { color: '#E8C488', fontSize: 12, letterSpacing: 2.4, textTransform: 'uppercase', marginTop: 26 },
  noteValue: { color: '#FFF7E8', fontSize: 20, lineHeight: 28, marginTop: 10 },
  ritualSection: { flexDirection: Platform.select({ web: 'row', default: 'column' }), gap: 28, alignItems: Platform.select({ web: 'flex-start', default: 'stretch' }) },
  ritualCopy: { flex: 1 },
  ritualList: { flex: 1, gap: 12 },
  ritualItem: { borderRadius: 24, padding: 22, backgroundColor: 'rgba(232,196,136,0.1)', borderWidth: 1, borderColor: 'rgba(232,196,136,0.18)' },
  ritualText: { color: '#FFF7E8', fontSize: 17, letterSpacing: 1.2, textTransform: 'uppercase' },
  finalCard: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    marginTop: 90,
    borderRadius: 38,
    padding: Platform.select({ web: 44, default: 26 }),
    backgroundColor: '#FFF7E8',
    alignItems: 'center',
  },
  finalTitle: { fontFamily: theme.fonts.display, color: '#100A16', fontSize: Platform.select({ web: 42, default: 30 }), letterSpacing: 2 },
  finalText: { color: 'rgba(16,10,22,0.68)', fontSize: 16, marginTop: 10, textAlign: 'center' },
});
