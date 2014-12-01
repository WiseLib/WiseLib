var Sql = require('sql');
var sql = new Sql.Sql('mysql');

/**
 * SQL definition for se2_1415.academic_discipline
 */
exports.academic_discipline = sql.define({
	name: 'academic_discipline',
	columns: [
		{ name: 'id' },
		{ name: 'part_of_academic_discipline_id' }
	]
});


/**
 * SQL definition for se2_1415.affiliation
 */
exports.affiliation = sql.define({
	name: 'affiliation',
	columns: [
		{ name: 'id' },
		{ name: 'part_of_affiliation_id' }
	]
});


/**
 * SQL definition for se2_1415.conference
 */
exports.conference = sql.define({
	name: 'conference',
	columns: [
		{ name: 'id' },
		{ name: 'rank' }
	]
});


/**
 * SQL definition for se2_1415.conference_has_academic_discipline
 */
exports.conference_has_academic_discipline = sql.define({
	name: 'conference_has_academic_discipline',
	columns: [
		{ name: 'conference_id' },
		{ name: 'academic_discipline_id' }
	]
});


/**
 * SQL definition for se2_1415.journal
 */
exports.journal = sql.define({
	name: 'journal',
	columns: [
		{ name: 'id' },
		{ name: 'rank' }
	]
});


/**
 * SQL definition for se2_1415.journal_has_academic_discipline
 */
exports.journal_has_academic_discipline = sql.define({
	name: 'journal_has_academic_discipline',
	columns: [
		{ name: 'journal_id' },
		{ name: 'academic_discipline_id' }
	]
});


/**
 * SQL definition for se2_1415.journal_publication_is_part_of_journal
 */
exports.journal_publication_is_part_of_journal = sql.define({
	name: 'journal_publication_is_part_of_journal',
	columns: [
		{ name: 'publication_id' },
		{ name: 'journal_id' }
	]
});


/**
 * SQL definition for se2_1415.person
 */
exports.person = sql.define({
	name: 'person',
	columns: [
		{ name: 'first_name' },
		{ name: 'last_name' },
		{ name: 'id' },
		{ name: 'picture' }
	]
});


/**
 * SQL definition for se2_1415.proceeding_publication_is_part_of_conference
 */
exports.proceeding_publication_is_part_of_conference = sql.define({
	name: 'proceeding_publication_is_part_of_conference',
	columns: [
		{ name: 'conference_id' },
		{ name: 'publication_id' }
	]
});


/**
 * SQL definition for se2_1415.publication
 */
exports.publication = sql.define({
	name: 'publication',
	columns: [
		{ name: 'id' },
		{ name: 'publication_type' },
		{ name: 'title' },
		{ name: 'publication_title' },
		{ name: 'nr_of_pages' },
		{ name: 'published_in_year' },
		{ name: 'url' },
		{ name: 'held_in_city_name' },
		{ name: 'published_by_publisher_name' },
		{ name: 'rank' },
		{ name: 'published_by_user_id' },
		{ name: 'summary_text' },
		{ name: 'appeared_in_volume_nr' },
		{ name: 'appeared_in_nr' }
	]
});


/**
 * SQL definition for se2_1415.publication_edited_by_person
 */
exports.publication_edited_by_person = sql.define({
	name: 'publication_edited_by_person',
	columns: [
		{ name: 'publication_id' },
		{ name: 'person_id' }
	]
});


/**
 * SQL definition for se2_1415.publication_has_keyword
 */
exports.publication_has_keyword = sql.define({
	name: 'publication_has_keyword',
	columns: [
		{ name: 'publication_id' },
		{ name: 'keyword' }
	]
});


/**
 * SQL definition for se2_1415.publication_written_by_person
 */
exports.publication_written_by_person = sql.define({
	name: 'publication_written_by_person',
	columns: [
		{ name: 'publication_id' },
		{ name: 'person_id' }
	]
});


/**
 * SQL definition for se2_1415.user
 */
exports.user = sql.define({
	name: 'user',
	columns: [
		{ name: 'email_address' },
		{ name: 'part_of_affiliation_id' },
		{ name: 'password' },
		{ name: 'person_id' },
		{ name: 'id' }
	]
});


/**
 * SQL definition for se2_1415.user_studies_academic_discipline
 */
exports.user_studies_academic_discipline = sql.define({
	name: 'user_studies_academic_discipline',
	columns: [
		{ name: 'academic_discipline_id' },
		{ name: 'user_id' }
	]
});


