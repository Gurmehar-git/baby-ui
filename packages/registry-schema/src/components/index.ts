import type { ComponentSpec } from "../index.ts";
import { accordion } from "./accordion.ts";
import { actionButton } from "./action-button.ts";
import { agentScreen } from "./agent-screen.ts";
import { alertDialog } from "./alert-dialog.ts";
import { alert } from "./alert.ts";
import { animatedGradientText } from "./animated-gradient-text.ts";
import { animatedGradient } from "./animated-gradient.ts";
import { announcementBar } from "./announcement-bar.ts";
import { areaChart } from "./area-chart.ts";
import { asciiEffect } from "./ascii-effect.ts";
import { attachment } from "./attachment.ts";
import { auroraFlow } from "./aurora-flow.ts";
import { authForm } from "./auth-form.ts";
import { avatar } from "./avatar.ts";
import { badge } from "./badge.ts";
import { barChart } from "./bar-chart.ts";
import { bentoGrid } from "./bento-grid.ts";
import { billingToggle } from "./billing-toggle.ts";
import { blogGrid } from "./blog-grid.ts";
import { boldCopy } from "./bold-copy.ts";
import { breadcrumb } from "./breadcrumb.ts";
import { buttonGroup } from "./button-group.ts";
import { button } from "./button.ts";
import { calendar, rangeCalendar } from "./calendar.ts";
import { candlestickChart } from "./candlestick-chart.ts";
import { cardStack } from "./card-stack.ts";
import { card } from "./card.ts";
import { carousel } from "./carousel.ts";
import { caseStudyFlipStack } from "./case-study-flip-stack.ts";
import { changelogFeed } from "./changelog-feed.ts";
import { chartBrush } from "./chart-brush.ts";
import { chartMarkers } from "./chart-markers.ts";
import { chartSeries } from "./chart-series.ts";
import { chart, lineChart } from "./chart.ts";
import { chatComposer } from "./chat-composer.ts";
import { checkbox } from "./checkbox.ts";
import { choroplethChart } from "./choropleth-chart.ts";
import { chromaticWave } from "./chromatic-wave.ts";
import { circuitBoard } from "./circuit-board.ts";
import { circularText } from "./circular-text.ts";
import { clickSpark } from "./click-spark.ts";
import { closingPlasma } from "./closing-plasma.ts";
import { codeBlock } from "./code-block.ts";
import { collabCard } from "./collab-card.ts";
import { collapsible } from "./collapsible.ts";
import { collectionSurfer } from "./collection-surfer.ts";
import { colorPicker } from "./color-picker.ts";
import { combobox } from "./combobox.ts";
import { command } from "./command.ts";
import { commentThread } from "./comment-thread.ts";
import { comparisonTable } from "./comparison-table.ts";
import { composedChart } from "./composed-chart.ts";
import { composer } from "./composer.ts";
import { confirmMorph } from "./confirm-morph.ts";
import { contactSection } from "./contact-section.ts";
import { contextCards } from "./context-cards.ts";
import { contextMenu } from "./context-menu.ts";
import { conversation } from "./conversation.ts";
import { copyButton } from "./copy-button.ts";
import { countdown } from "./countdown.ts";
import { ctaSection } from "./cta-section.ts";
import { cubeText } from "./cube-text.ts";
import { dataTable } from "./data-table.ts";
import { dateField, datePicker, dateRangePicker, timePicker } from "./date-picker.ts";
import { diaText } from "./dia-text.ts";
import { dialog } from "./dialog.ts";
import { diffTable } from "./diff-table.ts";
import { ditherGradient } from "./dither-gradient.ts";
import { ditheredLogo } from "./dithered-logo.ts";
import { docsNav } from "./docs-nav.ts";
import { dotMatrixGlow } from "./dot-matrix-glow.ts";
import { draggableMarquee } from "./draggable-marquee.ts";
import { drawer } from "./drawer.ts";
import { dropdownMenu } from "./dropdown-menu.ts";
import { emailKit } from "./email-kit.ts";
import { emailMagicLink } from "./email-magic-link.ts";
import { emailPasswordReset } from "./email-password-reset.ts";
import { emailReceipt } from "./email-receipt.ts";
import { emailTeamInvite } from "./email-team-invite.ts";
import { emailVerify } from "./email-verify.ts";
import { emailWelcome } from "./email-welcome.ts";
import { empty } from "./empty.ts";
import { errorBoundary } from "./error-boundary.ts";
import { expandableCard } from "./expandable-card.ts";
import { expandingButtonGroup } from "./expanding-button-group.ts";
import { expandingSearch } from "./expanding-search.ts";
import { faqSection } from "./faq-section.ts";
import { field } from "./field.ts";
import { fileDiff } from "./file-diff.ts";
import { fileTree } from "./file-tree.ts";
import { fileUpload } from "./file-upload.ts";
import { fillButton } from "./fill-button.ts";
import { filterTable } from "./filter-table.ts";
import { fineTuneCard } from "./fine-tune-card.ts";
import { flightStatusCard } from "./flight-status-card.ts";
import { floatingButtonGroup } from "./floating-button-group.ts";
import { flowchart } from "./flowchart.ts";
import { footer } from "./footer.ts";
import { form } from "./form.ts";
import { fullscreenNav } from "./fullscreen-nav.ts";
import { funnelChart } from "./funnel-chart.ts";
import { gaugeChart } from "./gauge-chart.ts";
import { gibberishText } from "./gibberish-text.ts";
import { githubCalendar } from "./github-calendar.ts";
import { githubStatsBlock } from "./github-stats.ts";
import { glitchText } from "./glitch-text.ts";
import { gradientHero01 } from "./gradient-hero-01.ts";
import { grainGradient } from "./grain-gradient.ts";
import { heatmapChart } from "./heatmap-chart.ts";
import { heroStage } from "./hero-stage.ts";
import { holdToConfirm } from "./hold-to-confirm.ts";
import { hoverCard } from "./hover-card.ts";
import { hoverTransition } from "./hover-transition.ts";
import { iconMorph } from "./icon-morph.ts";
import { imageCompare } from "./image-compare.ts";
import { imageTrail } from "./image-trail.ts";
import { infiniteImageField } from "./infinite-image-field.ts";
import { inlineEdit } from "./inline-edit.ts";
import { inputGroup } from "./input-group.ts";
import { inputOtp } from "./input-otp.ts";
import { input } from "./input.ts";
import { invoiceList } from "./invoice-list.ts";
import { iridescentFold } from "./iridescent-fold.ts";
import { label } from "./label.ts";
import { letterMorph } from "./letter-morph.ts";
import { lightCaustics } from "./light-caustics.ts";
import { liquidChrome } from "./liquid-chrome.ts";
import { liveLineChart } from "./live-line-chart.ts";
import { loadingScreen } from "./loading-screen.ts";
import { loadingState } from "./loading-state.ts";
import { logoCarousel } from "./logo-carousel.ts";
import { magnetLines } from "./magnet-lines.ts";
import { markdown } from "./markdown.ts";
import { marker } from "./marker.ts";
import { maskText } from "./mask-text.ts";
import { megaNavbar } from "./mega-navbar.ts";
import { mentionInput } from "./mention-input.ts";
import { message } from "./message.ts";
import { mirrorText } from "./mirror-text.ts";
import { moneyInput } from "./money-input.ts";
import { morphSelect } from "./morph-select.ts";
import { morphText } from "./morph-text.ts";
import { morphingModal } from "./morphing-modal.ts";
import { multiSelect } from "./multi-select.ts";
import { musicPlayer } from "./music-player.ts";
import { nativeSelect } from "./native-select.ts";
import { navigationMenu } from "./navigation-menu.ts";
import { newsletterSignup } from "./newsletter-signup.ts";
import { notchedShelf } from "./notched-shelf.ts";
import { notificationCenter } from "./notification-center.ts";
import { npmStatsBlock } from "./npm-stats.ts";
import { numberInput } from "./number-input.ts";
import { ogAppIcon } from "./og-app-icon.ts";
import { ogAppTile } from "./og-app-tile.ts";
import { ogBigIcon } from "./og-big-icon.ts";
import { ogBlogPost } from "./og-blog-post.ts";
import { ogChangelog } from "./og-changelog.ts";
import { ogCtaPill } from "./og-cta-pill.ts";
import { ogDocsPage } from "./og-docs-page.ts";
import { ogEditorialBio } from "./og-editorial-bio.ts";
import { ogGithubRepo } from "./og-github-repo.ts";
import { ogGuides } from "./og-guides.ts";
import { ogHairlines } from "./og-hairlines.ts";
import { ogHalo } from "./og-halo.ts";
import { ogJobPosting } from "./og-job-posting.ts";
import { ogNewsletterIssue } from "./og-newsletter-issue.ts";
import { ogPaperWindow } from "./og-paper-window.ts";
import { ogPodcastEpisode } from "./og-podcast-episode.ts";
import { ogPricing } from "./og-pricing.ts";
import { ogProductLaunch } from "./og-product-launch.ts";
import { ogProductShop } from "./og-product-shop.ts";
import { ogPromptPhoto } from "./og-prompt-photo.ts";
import { ogPrompt } from "./og-prompt.ts";
import { ogScatter } from "./og-scatter.ts";
import { ogShowcase } from "./og-showcase.ts";
import { ogSoftFocus } from "./og-soft-focus.ts";
import { ogSplit } from "./og-split.ts";
import { ogSpotlight } from "./og-spotlight.ts";
import { ogStatement } from "./og-statement.ts";
import { ogStatsMetrics } from "./og-stats-metrics.ts";
import { ogTagline } from "./og-tagline.ts";
import { ogTestimonial } from "./og-testimonial.ts";
import { ogTiltedScreen } from "./og-tilted-screen.ts";
import { ogWordmark } from "./og-wordmark.ts";
import { orbitCardStack } from "./orbit-card-stack.ts";
import { orbitHero } from "./orbit-hero.ts";
import { overviewCard } from "./overview-card.ts";
import { pageHeader } from "./page-header.ts";
import { pagination } from "./pagination.ts";
import { particleText } from "./particle-text.ts";
import { passwordInput } from "./password-input.ts";
import { phoneInput } from "./phone-input.ts";
import { pieChart } from "./pie-chart.ts";
import { pixelCanvas } from "./pixel-canvas.ts";
import { pixelImageTrail } from "./pixel-image-trail.ts";
import { popover } from "./popover.ts";
import { pricing01 } from "./pricing-01.ts";
import { pricing02 } from "./pricing-02.ts";
import { progress } from "./progress.ts";
import { projectionLine } from "./projection-line.ts";
import { propertyPanel } from "./property-panel.ts";
import { question } from "./question.ts";
import { radarChart } from "./radar-chart.ts";
import { radioGroup } from "./radio-group.ts";
import { reasoning } from "./reasoning.ts";
import { recommendationCard } from "./recommendation-card.ts";
import { recordsTable } from "./records-table.ts";
import { resizable } from "./resizable.ts";
import { responsiveDialog } from "./responsive-dialog.ts";
import { revealText } from "./reveal-text.ts";
import { ridgelineChart } from "./ridgeline-chart.ts";
import { ringChart } from "./ring-chart.ts";
import { rippleTransition } from "./ripple-transition.ts";
import { rollText } from "./roll-text.ts";
import { rollingDigits } from "./rolling-digits.ts";
import { sankeyChart } from "./sankey-chart.ts";
import { scatterChart } from "./scatter-chart.ts";
import { scoreCard } from "./score-card.ts";
import { scrollArea } from "./scroll-area.ts";
import { scrollChoreography } from "./scroll-choreography.ts";
import { scrollProgress } from "./scroll-progress.ts";
import { scrollReveal } from "./scroll-reveal.ts";
import { scrollSplitCard } from "./scroll-split-card.ts";
import { scrollTiltedGrid } from "./scroll-tilted-grid.ts";
import { searchInput } from "./search-input.ts";
import { select } from "./select.ts";
import { separator } from "./separator.ts";
import { sheet } from "./sheet.ts";
import { shimmerText } from "./shimmer-text.ts";
import { shortcutRecorder } from "./shortcut-recorder.ts";
import { shortcut } from "./shortcut.ts";
import { showMore } from "./show-more.ts";
import { showcaseGrid } from "./showcase-grid.ts";
import { sidebarNav } from "./sidebar-nav.ts";
import { signaturePad } from "./signature-pad.ts";
import { signature } from "./signature.ts";
import { skeleton } from "./skeleton.ts";
import { slider } from "./slider.ts";
import { slopeChart } from "./slope-chart.ts";
import { slotText } from "./slot-text.ts";
import { sparkline } from "./sparkline.ts";
import { spectralRibbon } from "./spectral-ribbon.ts";
import { spinner } from "./spinner.ts";
import { splitButton } from "./split-button.ts";
import { splitFlapDisplay } from "./split-flap-display.ts";
import { splitText } from "./split-text.ts";
import { starHistoryBlock } from "./star-history.ts";
import { statCard, statCardMap } from "./stat-card.ts";
import { statsBand } from "./stats-band.ts";
import { statusMonitor } from "./status-monitor.ts";
import { stepper } from "./stepper.ts";
import { stickyScrollCards } from "./sticky-scroll-cards.ts";
import { streamgraphChart } from "./streamgraph-chart.ts";
import { streamingText } from "./streaming-text.ts";
import { sunburstChart } from "./sunburst-chart.ts";
import { swappable } from "./swappable.ts";
import { swipeActions } from "./swipe-actions.ts";
import { switchComponent } from "./switch.ts";
import { tableOfContents } from "./table-of-contents.ts";
import { table } from "./table.ts";
import { tabs } from "./tabs.ts";
import { tagInput } from "./tag-input.ts";
import { taskSteps } from "./task-steps.ts";
import { textLoop } from "./text-loop.ts";
import { textReel } from "./text-reel.ts";
import { textRepel } from "./text-repel.ts";
import { textTransition } from "./text-transition.ts";
import { textarea } from "./textarea.ts";
import { themeToggle } from "./theme-toggle.ts";
import { timeline } from "./timeline.ts";
import { toast } from "./toast.ts";
import { toggleGroup } from "./toggle-group.ts";
import { toggle } from "./toggle.ts";
import { toolChips } from "./tool-chips.ts";
import { tool } from "./tool.ts";
import { tooltip } from "./tooltip.ts";
import { treemapChart } from "./treemap-chart.ts";
import { typingText } from "./typing-text.ts";
import { typography } from "./typography.ts";
import { underlineHoverText } from "./underline-hover-text.ts";
import { usageCard } from "./usage-card.ts";
import { userMenu } from "./user-menu.ts";
import { videoPlayer } from "./video-player.ts";
import { waffleChart } from "./waffle-chart.ts";
import { webglLiquid } from "./webgl-liquid.ts";
import { weekCalendar } from "./week-calendar.ts";
import { wheelCarousel } from "./wheel-carousel.ts";
import { wheelPicker } from "./wheel-picker.ts";

export const specs: ComponentSpec[] = [
	accordion,
	actionButton,
	agentScreen,
	alertDialog,
	alert,
	animatedGradientText,
	animatedGradient,
	announcementBar,
	areaChart,
	asciiEffect,
	attachment,
	auroraFlow,
	authForm,
	avatar,
	badge,
	barChart,
	bentoGrid,
	billingToggle,
	blogGrid,
	boldCopy,
	breadcrumb,
	buttonGroup,
	button,
	calendar,
	rangeCalendar,
	candlestickChart,
	cardStack,
	card,
	carousel,
	caseStudyFlipStack,
	changelogFeed,
	chartBrush,
	chartMarkers,
	chartSeries,
	chart,
	lineChart,
	chatComposer,
	checkbox,
	choroplethChart,
	chromaticWave,
	circuitBoard,
	circularText,
	clickSpark,
	closingPlasma,
	codeBlock,
	collabCard,
	collapsible,
	collectionSurfer,
	colorPicker,
	combobox,
	command,
	commentThread,
	comparisonTable,
	composedChart,
	composer,
	confirmMorph,
	contactSection,
	contextCards,
	contextMenu,
	conversation,
	copyButton,
	countdown,
	ctaSection,
	cubeText,
	dataTable,
	dateField,
	datePicker,
	dateRangePicker,
	timePicker,
	diaText,
	dialog,
	diffTable,
	ditherGradient,
	ditheredLogo,
	docsNav,
	dotMatrixGlow,
	draggableMarquee,
	drawer,
	dropdownMenu,
	emailKit,
	emailMagicLink,
	emailPasswordReset,
	emailReceipt,
	emailTeamInvite,
	emailVerify,
	emailWelcome,
	empty,
	errorBoundary,
	expandableCard,
	expandingButtonGroup,
	expandingSearch,
	faqSection,
	field,
	fileDiff,
	fileTree,
	fileUpload,
	fillButton,
	filterTable,
	fineTuneCard,
	flightStatusCard,
	floatingButtonGroup,
	flowchart,
	footer,
	form,
	fullscreenNav,
	funnelChart,
	gaugeChart,
	gibberishText,
	githubCalendar,
	githubStatsBlock,
	glitchText,
	gradientHero01,
	grainGradient,
	heatmapChart,
	heroStage,
	holdToConfirm,
	hoverCard,
	hoverTransition,
	iconMorph,
	imageCompare,
	imageTrail,
	infiniteImageField,
	inlineEdit,
	inputGroup,
	inputOtp,
	input,
	invoiceList,
	iridescentFold,
	label,
	letterMorph,
	lightCaustics,
	liquidChrome,
	liveLineChart,
	loadingScreen,
	loadingState,
	logoCarousel,
	magnetLines,
	markdown,
	marker,
	maskText,
	megaNavbar,
	mentionInput,
	message,
	mirrorText,
	moneyInput,
	morphSelect,
	morphText,
	morphingModal,
	multiSelect,
	musicPlayer,
	nativeSelect,
	navigationMenu,
	newsletterSignup,
	notchedShelf,
	notificationCenter,
	npmStatsBlock,
	numberInput,
	ogAppIcon,
	ogAppTile,
	ogBigIcon,
	ogBlogPost,
	ogChangelog,
	ogCtaPill,
	ogDocsPage,
	ogEditorialBio,
	ogGithubRepo,
	ogGuides,
	ogHairlines,
	ogHalo,
	ogJobPosting,
	ogNewsletterIssue,
	ogPaperWindow,
	ogPodcastEpisode,
	ogPricing,
	ogProductLaunch,
	ogProductShop,
	ogPromptPhoto,
	ogPrompt,
	ogScatter,
	ogShowcase,
	ogSoftFocus,
	ogSplit,
	ogSpotlight,
	ogStatement,
	ogStatsMetrics,
	ogTagline,
	ogTestimonial,
	ogTiltedScreen,
	ogWordmark,
	orbitCardStack,
	orbitHero,
	overviewCard,
	pageHeader,
	pagination,
	particleText,
	passwordInput,
	phoneInput,
	pieChart,
	pixelCanvas,
	pixelImageTrail,
	popover,
	pricing01,
	pricing02,
	progress,
	projectionLine,
	propertyPanel,
	question,
	radarChart,
	radioGroup,
	reasoning,
	recommendationCard,
	recordsTable,
	resizable,
	responsiveDialog,
	revealText,
	ridgelineChart,
	ringChart,
	rippleTransition,
	rollText,
	rollingDigits,
	sankeyChart,
	scatterChart,
	scoreCard,
	scrollArea,
	scrollChoreography,
	scrollProgress,
	scrollReveal,
	scrollSplitCard,
	scrollTiltedGrid,
	searchInput,
	select,
	separator,
	sheet,
	shimmerText,
	shortcutRecorder,
	shortcut,
	showMore,
	showcaseGrid,
	sidebarNav,
	signaturePad,
	signature,
	skeleton,
	slider,
	slopeChart,
	slotText,
	sparkline,
	spectralRibbon,
	spinner,
	splitButton,
	splitFlapDisplay,
	splitText,
	starHistoryBlock,
	statCard,
	statCardMap,
	statsBand,
	statusMonitor,
	stepper,
	stickyScrollCards,
	streamgraphChart,
	streamingText,
	sunburstChart,
	swappable,
	swipeActions,
	switchComponent,
	tableOfContents,
	table,
	tabs,
	tagInput,
	taskSteps,
	textLoop,
	textReel,
	textRepel,
	textTransition,
	textarea,
	themeToggle,
	timeline,
	toast,
	toggleGroup,
	toggle,
	toolChips,
	tool,
	tooltip,
	treemapChart,
	typingText,
	typography,
	underlineHoverText,
	usageCard,
	userMenu,
	videoPlayer,
	waffleChart,
	webglLiquid,
	weekCalendar,
	wheelCarousel,
	wheelPicker,
];

export function getSpec(slug: string): ComponentSpec | undefined {
	return specs.find((s) => s.slug === slug);
}
