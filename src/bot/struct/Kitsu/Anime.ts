/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
class Anime {
	public id: any;
	public type: any;
	public slug: any;
	public synopsis: any;
	public titles: { english: any; romaji: any; japanese: any; canonical: any; abbreviated: any; };
	public averageRating: any;
	public ratingFrequencies: any;
	public userCount: any;
	public favoritesCount: any;
	public startDate: any;
	public endDate: any;
	public popularityRank: any;
	public ratingRank: any;
	public ageRating: any;
	public ageRatingGuide: any;
	public subType: any;
	public posterImage: any;
	public coverImage: any;
	public episodeCount: any;
	public episodeLength: any;
	public youtubeVideoId: any;
	public showType: any;
	public nsfw: any;
	constructor(data) {
		this.id = data.id;
		this.type = data.type;
		this.slug = data.attributes.slug;
		this.synopsis = data.attributes.synopsis;
		this.titles = {
			english: data.attributes.titles.en,
			romaji: data.attributes.titles.en_jp,
			japanese: data.attributes.titles.ja_jp,
			canonical: data.attributes.canonicalTitle,
			abbreviated: data.attributes.abbreviatedTitles
		};
		this.averageRating = data.attributes.averageRating;
		this.ratingFrequencies = data.attributes.ratingFrequencies;
		this.userCount = data.attributes.userCount;
		this.favoritesCount = data.attributes.favoritesCount;
		this.startDate = data.attributes.startDate;
		this.endDate = data.attributes.endDate;
		this.popularityRank = data.attributes.popularityRank;
		this.ratingRank = data.attributes.ratingRank;
		this.ageRating = data.attributes.ageRating;
		this.ageRatingGuide = data.attributes.ageRatingGuide;
		this.subType = data.attributes.subtype;
		this.posterImage = data.attributes.posterImage;
		this.coverImage = data.attributes.coverImage;
		this.episodeCount = data.attributes.episodeCount;
		this.episodeLength = data.attributes.episodeLength;
		this.youtubeVideoId = data.attributes.youtubeVideoId;
		this.showType = data.attributes.showType;
		this.nsfw = data.attributes.nsfw;
	}

	get url() {
		return `https://kitsu.io/anime/${this.id}/`;
	}

	get youtubeURL() {
		return this.youtubeVideoId ? `https://www.youtube.com/watch?v=${this.youtubeVideoId}` : null;
	}
}

export default Anime;
