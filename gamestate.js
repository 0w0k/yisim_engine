import { swogi, SECTS, format_card, CRASH_FIST_CARDS, ready } from './card_info.js';
export { ready };
let keys = Object.keys(swogi);
keys.sort();
export const CHARACTER_ID_TO_NAME = {
    "sw1": "Mu Yifeng",
    "sw2": "Yan Xue",
    "sw3": "Long Yao",
    "sw4": "Lin Xiaoyue",
    "sw5": "Lu Jianxin",
    "sw6": "Li Chengyun",
    "he1": "Tan Shuyan",
    "he2": "Yan Chen",
    "he3": "Yao Ling",
    "he4": "Jiang Ximing",
    "he5": "Wu Ce",
    "fe1": "Wu Xingzhi",
    "fe2": "Du Lingyuan",
    "fe3": "Hua Qinrui",
    "fe4": "Mu Hu",
    "fe5": "Nangong Sheng",
    "fe6": "Qi Wangyou",
    "dx1": "Xiao Bu",
    "dx2": "Tu Kui",
    "dx3": "Ye Mingming",
    "dx4": "Ji Fangsheng",
    "dx5": "Li Man",
}
const is_unrestrained_sword = function(card_id) {
    return swogi[card_id].is_unrestrained_sword;
}
const is_cloud_sword = function(card_id) {
    return swogi[card_id].is_cloud_sword;
}
const is_sword_formation = function(card_id) {
    return swogi[card_id].is_sword_formation;
}
const is_crash_fist = function(card_id) {
    return swogi[card_id].is_crash_fist;
}
const is_wood_spirit = function(card_id) {
    return swogi[card_id].is_wood_spirit;
}
const is_fire_spirit = function(card_id) {
    return swogi[card_id].is_fire_spirit;
}
const is_earth_spirit = function(card_id) {
    return swogi[card_id].is_earth_spirit;
}
const is_metal_spirit = function(card_id) {
    return swogi[card_id].is_metal_spirit;
}
const is_water_spirit = function(card_id) {
    return swogi[card_id].is_water_spirit;
}
const is_add_physique = function(card_id) {
    return swogi[card_id].is_add_physique;
}
const is_astral_move = function(card_id) {
    return swogi[card_id].is_astral_move;
}
const is_post_action = function(card_id) {
    return swogi[card_id].is_post_action;
}
const is_thunder = function(card_id) {
    return swogi[card_id].is_thunder;
}
const is_seal = function(card_id) {
    return swogi[card_id].is_seal;
}
const is_spirit_sword = function(card_id) {
    return swogi[card_id].is_spirit_sword;
}
const DEBUFF_NAMES = [
    "internal_injury",
    "decrease_atk",
    "weaken",
    "flaw",
    "entangle",
    "wound",
    "styx",
];
function is_debuff(attr_name) {
    if (attr_name === "internal_injury") return true;
    if (attr_name === "decrease_atk") return true;
    if (attr_name === "weaken") return true;
    if (attr_name === "flaw") return true;
    if (attr_name === "entangle") return true;
    if (attr_name === "wound") return true;
    if (attr_name === "styx") return true;
    return false;
}
const ACTIVATE_NAMES = [
];
function is_activate(attr_name) {
}
export class Player {
    constructor() {
        this.cards = [];
        this.hand_cards = [];
        this.can_play = []; // used for consumption/continuous cards
        this.reset();
    }
    reset() {
        this.next_card_index = 0;
        this.cards.length = 0;
        this.can_play.length = 0; // used for consumption/continuous cards
        this.round_number = 15;
        this.destiny = 30;
        this.cultivation = 70;
        this.speed = 0;
        this.qi = 0;
        this.hp = 400;
        this.max_hp = 400;
        this.def = 0;
        this.this_card_attacked = false; // whether the player has attacked with this card
        this.this_card_directly_attacked = false; // whether this card attacked, excluding attacks by triggering other cards
        this.this_trigger_directly_attacked = false; // whether this card (the triggering one) attacked, excluding attacks by triggering other cards
        this.this_turn_attacked = false; // whether the player has attacked this turn
        this.this_atk_injured = false; // whether the enemy hp has been injured by this atk
        this.damage_dealt_to_hp_by_atk = 0; // for stuff that keys off how much damage went through to hp
        this.bonus_rep_amt = 0; // card-specific bonus rep
        this.bonus_force_amt = 0;
        // for situations where multiple chases are allowed (Loong),
        // I'm not sure whether a single card chasing two times works the same as two cards chasing once.
        // So cards record their chases in `this_card_chases`, and then we can change how we apply that to
        // `chases` later. Also, what's the interaction of 2 chase on 1 card with entangle?
        // we can check irl i guess...
        this.this_card_chases = 0;
        this.chases = 0;
        this.max_chases = 1;
        this.currently_playing_card_idx = undefined;
        this.currently_triggering_card_idx = undefined;
        this.currently_triggering_card_id = undefined;
        this.trigger_depth = 0; // used to decide whether "continuous" and "consumption" deactivate a card
        this.increase_atk = 0;
        this.regen = 0;


        // debuffs
        this.internal_injury = 0;
        this.decrease_atk = 0;
        this.weaken = 0;
        this.flaw = 0;
        this.entangle = 0;
        this.wound = 0;


        // cloud sword sect normal cards
        this.cloud_sword_chain_count = 0;


        // cloud sword sect secret enchantment cards
        this.ignore_weaken = false;


        // cloud sword sect character-specific cards
        this.cloud_sword_clear_heart_stacks = 0;


        // cloud sword sect legendary cards


        // heptastar sect normal cards
        this.card_play_direction = 1;


        // heptastar sect secret enchantment cards


        // heptastar sect character-specific cards


        // heptastar sect legendary cards


        // five elements sect normal cards


        // five elements sect secret enchantment cards


        // five elements sect character-specific cards


        // five elements sect legendary cards


        // duan xuan sect normal cards
        this.agility = 0;
        this.physique = 0;
        this.max_physique = 0;
        this.physique_gained = 0;
        this.ignore_decrease_atk = false;


        // duan xuan sect secret enchantment cards


        // duan xuan sect character-specific cards
        this.styx = 0;
        this.meditation_of_xuan_stacks = 0;


        // musician side job cards


        // painter side job cards


        // formation master side job cards


        // plant master side job cards
        // TODO: implement most of the below plants
        // divine_power_grass_stacks -> increase_atk
        // lose_power_grass_stacks -> decrease_atk
        // healing_chamomile_stacks -> regen
        // clear_chamomile_stacks -> hexproof
        // flying_owl_reishi_stacks -> speed
        // shadow_owl_reishi_stacks -> flying_brush_stacks
        // toxic_purple_fern_stacks -> internal_injury


        // fortune teller side job cards


        // talisman cards


        // spiritual pet cards


        // general immortal fates


        // cloud sword sect immortal fates
        this.quench_of_sword_heart_cloud_stacks = 0;
        this.chengyuns_fusion_style_stacks = 0;
        this.swordplay_talent_cards = [];


        // heptastar sect immortal fates

        // five elements sect immortal fates


        // duan xuan sect immortal fates
        this.p3_regenerating_body_stacks = 0;
        this.zen_mind_forging_body_stacks = 0;


        // life shop buffs


        // super serious event buffs


        // immortal relics fusion cards


        // spacetime mirage mirage/future cards


        // merpeople pearls


        // general resonance immortal fates


        // cloud sword sect resonance immortal fates
        // this.resonance_sword_rhyme_cultivate_stacks = 0;
        // this.resonance_rule_of_the_cloud_stacks = 0;
        // this.resonance_sword_pool_the_heart_ask_stacks = 0;
        // this.resonance_sword_in_sheathed_stacks = 0;
        // this.resonance_endurance_as_cloud_sea_stacks = 0;
        // this.resonance_fire_flame_blade_stacks = 0;
        // this.resonance_drift_ice_blade_stacks = 0;
        // this.resonance_dragon_scale_stacks = 0;
        // this.resonance_pray_rain_stacks = 0;
        // this.resonance_spirit_cat_chaos_sword_stacks = 0;
        // this.resonance_lithe_as_cat_stacks = 0;
        // this.resonance_blade_forging_stacks = 0;
        // this.resonance_sword_pattern_carving_stacks = 0;
        // this.resonance_qi_forging_stacks = 0;
        // this.resonance_wind_rose_stacks = 0;
        // this.resonance_yeying_sword_formation_stacks = 0;
        // this.can_trigger_resonance_yeying_sword_formation = true;


        // heptastar sect resonance immortal fates
        // this.resonance_divination_stacks = 0;
        // this.resonance_stargaze_stacks = 0;
        // this.resonance_post_strike_stacks = 0;
        // this.resonance_astral_eclipse_stacks = 0;
        // this.resonance_inheritance_of_thunder_stacks = 0;
        // this.resonance_birdie_wind_stacks = 0;
        // this.resonance_avatar_of_bird_shade_stacks = 0;
        // this.resonance_bloodline_power_stacks = 0;
        // this.resonance_fury_thunder_stacks = 0;
        // this.resonance_innate_spirit_body_stacks = 0;
        // this.resonance_flame_flutter_stacks = 0;
        // this.resonance_rotary_divination_hexagram_stacks = 0;
        // this.resonance_astrology_stacks = 0;
        // this.resonance_starburst_stacks = 0;
        // this.resonance_heptastar_soulstat_stacks = 0;
        // this.resonance_astral_divination_hexagram_stacks = 0;
        // this.resonance_perfectly_planned_stacks = 0;
        // this.resonance_rest_and_outwit_stacks = 0;
        // this.resonance_act_underhand_stacks = 0;
        // this.resonance_star_moon_folding_fan_stacks = 0;


        // five elements sect resonance immortal fates


        // duan xuan sect resonance immortal fates
    }
    reset_can_play() {
        this.cards = this.cards.slice();
        this.can_play.length = 0;
        const n_cards = this.cards.length;
        for (let i=0; i<n_cards; i++) {
            this.can_play.push(true);
        }
    }
    post_deck_setup() {
        this.reset_can_play();
    }
}
export class GameState {
    constructor(a, b) {
        this.indentation = "";
        if (a === undefined) {
            a = new Player();
        } else {
            a.reset();
        }
        if (b === undefined) {
            b = new Player();
        } else {
            b.reset();
        }
        this.players = [a, b];
        this.output = [];
        this.used_randomness = false;
    }
    crash() {
        this.dump();
        console.trace();
        process.exit(1);
    }
    dump() {
        console.log(this.output.join("\n"));
    }
    log(str) {
        this.output.push(this.indentation + str);
        //console.log(this.indentation + str);
    }
    indent() {
        this.indentation += "  ";
    }
    unindent() {
        this.indentation = this.indentation.substring(2);
    }
    get_n_different_five_elements(idx) {
        const cards = this.players[idx].cards;
        let has_wood = false;
        let has_fire = false;
        let has_earth = false;
        let has_metal = false;
        let has_water = false;
        let different_elements = 0;
        for (let i=0; i<cards.length; i++) {
            let card_id = cards[i];
            let card = swogi[card_id];
            if (card.is_wood_spirit && !has_wood) {
                has_wood = true;
                different_elements += 1;
            }
            if (card.is_fire_spirit && !has_fire) {
                has_fire = true;
                different_elements += 1;
            }
            if (card.is_earth_spirit && !has_earth) {
                has_earth = true;
                different_elements += 1;
            }
            if (card.is_metal_spirit && !has_metal) {
                has_metal = true;
                different_elements += 1;
            }
            if (card.is_water_spirit && !has_water) {
                has_water = true;
                different_elements += 1;
            }
        }
        return different_elements;
    }
    do_zen_mind_forging_body(idx) {
        const me = this.players[idx];
        if (me.zen_mind_forging_body_stacks === 0) {
            return;
        }
        this.increase_idx_physique(idx, me.zen_mind_forging_body_stacks);
    }
    try_upgrade_card(player_idx, card_idx) {
        const card_id = this.players[player_idx].cards[card_idx];
        const upgrade_level = card_id.substring(card_id.length - 1);
        if (upgrade_level === "3") {
            return false;
        }
        const new_level = parseInt(upgrade_level) + 1;
        const new_card_id = card_id.substring(0, card_id.length - 1) + new_level;
        if (swogi[new_card_id].does_not_exist) {
            return false;
        }
        this.players[player_idx].cards[card_idx] = new_card_id;
        this.log("player " + player_idx + " upgrades " + format_card(card_id) + " to " + format_card(new_card_id));
        return true;
    }
    try_downgrade_card(player_idx, card_idx) {
        const card_id = this.players[player_idx].cards[card_idx];
        const upgrade_level = card_id.substring(card_id.length - 1);
        if (upgrade_level === "1") {
            return false;
        }
        const new_level = parseInt(upgrade_level) - 1;
        const new_card_id = card_id.substring(0, card_id.length - 1) + new_level;
        if (swogi[new_card_id].does_not_exist) {
            return false;
        }
        this.players[player_idx].cards[card_idx] = new_card_id;
        this.log("player " + player_idx + " downgrades " + format_card(card_id) + " to " + format_card(new_card_id));
        return true;
    }
    do_opening(card_idx, trigger_idx) {
        const me = this.players[0];
        const card_id = me.cards[card_idx];
        const card = swogi[card_id];
        const action = card.opening;
        if (action === undefined) {
            return;
        }
        if (trigger_idx === undefined) {
            trigger_idx = card_idx;
        }
        const prev_triggering_idx = me.currently_triggering_card_idx;
        const prev_triggering_id = me.currently_triggering_card_id;
        const prev_bonus_rep_amt = me.bonus_rep_amt;
        const prev_this_trigger_directly_attacked = me.this_trigger_directly_attacked;
        me.currently_triggering_card_idx = trigger_idx;
        me.currently_triggering_card_id = card_id;
        me.bonus_rep_amt = 0;
        me.this_trigger_directly_attacked = false;
        this.do_action(action);
        me.currently_triggering_card_idx = prev_triggering_idx;
        me.currently_triggering_card_id = prev_triggering_id;
        me.bonus_rep_amt = prev_bonus_rep_amt;
        me.this_trigger_directly_attacked = prev_this_trigger_directly_attacked;
    }
    start_of_game_setup() {
        //for (let idx = 0; idx < 2; idx++) {
        //    this.players[idx].max_hp += this.players[idx].physique;
        //}
        for (let idx = 0; idx < 2; idx++) {
            this.players[idx].post_deck_setup();
        }
        for (let idx = 0; idx < 2; idx++) {
            this.do_zen_mind_forging_body(idx);
            this.do_resonance_setup(idx);
            if (idx === 1) {
                this.swap_players();
            }
            const nc = this.players[0].cards.length;
            for (let card_idx = 0; card_idx < nc; card_idx++) {
                this.do_opening(card_idx);
            }
            if (idx === 1) {
                this.swap_players();
            }
        }
    }
    swap_players() {
        const players = this.players;
        const temp = players[0];
        players[0] = players[1];
        players[1] = temp;
    }
    sim_n_turns(n) {
        this.start_of_game_setup();
        let i = 0;
        for (; i<n; i++) {
            this.log("turn " + i + " begins");
            this.indent();
            if (i % 2 === 1) {
                this.swap_players();
            }
            this.sim_turn();
            if (i % 2 === 1) {
                this.swap_players();
            }
            this.unindent();
            this.log("turn " + i + " ends");
            if (this.game_over) {
                break;
            }
        }
        let winner = 0;
        if (this.players[0].hp < this.players[1].hp) {
            winner = 1;
        }
        this.winner = winner;
        this.turns_taken = i;
        const winner_character_id = this.players[winner].character;
        const winner_character = CHARACTER_ID_TO_NAME[winner_character_id];
        this.log("player " + winner + " (" + winner_character + ") wins");
    }
    sim_n_turns_zongzi(n) {
        this.start_of_game_setup();
        let i = 0;
        for (; i<n; i++) {
            this.log("turn " + i + " begins");
            this.indent();
            this.sim_turn();
            this.unindent();
            this.log("turn " + i + " ends");
            if (this.game_over) {
                break;
            }
        }
        let winner = 0;
        if (this.players[0].hp < this.players[1].hp) {
            winner = 1;
        }
        this.winner = winner;
        this.turns_taken = i;
        const winner_character_id = this.players[winner].character;
        const winner_character = CHARACTER_ID_TO_NAME[winner_character_id];
        this.log("player " + winner + " (" + winner_character + ") wins");
    }
    do_action(arr) {
        // the actions list is like this: [["atk", 14], ["injured", ["regain_sword_intent"]]]
        // so we need to call this[arr[0]] passing in the rest of the array as arguments
        let ret = undefined;
        if (arr.length === 0) {
            this.log("empty action list");
            return ret;
        }
        // if arr[0] is actually an array, then try calling do_action on all the elements of arr
        if (Array.isArray(arr[0])) {
            for (let i=0; i<arr.length; i++) {
                ret = this.do_action(arr[i]);
            }
            return ret;
        }
        let action_name = arr[0];
        let args = arr.slice(1);
        if (this[action_name] === undefined) {
            this.log("action " + action_name + " is not defined");
            this.crash();
        }
        return this[action_name](...args);
    }
    do_cloud_sword_softheart_and_friends(card_id) {
        if (this.is_cloud_sword(card_id)) {
            const me = this.players[0];
            if (me.cloud_sword_clear_heart_stacks > 0) {
                this.chase();
                me.cloud_sword_clear_heart_stacks -= 1;
            }
        }
    }
    do_cloud_sword_chain_count(card_id) {
        const me = this.players[0];
        // if this card has "Cloud Sword" in the name, increment cloud_sword_chain_count
        if (this.is_cloud_sword(card_id)) {
            me.cloud_sword_chain_count += 1;
            this.log("incremented cloud_sword_chain_count to " + me.cloud_sword_chain_count);
        } else {
            if (me.cloud_sword_chain_count > 0
            ) {
                me.cloud_sword_chain_count = 0;
                this.log("reset cloud_sword_chain_count to 0");
            }
        }
    }
    do_regenerating_body(idx) {
        if (idx !== 0) {
            return;
        }
        const me = this.players[0];
        if (me.trigger_depth > 1) {
            return;
        }
        for (let i=0; i<me.p3_regenerating_body_stacks; i++) {
            this.increase_idx_physique(0, 1);
            this.increase_idx_hp(0, 2);
        }
    }
    is_crash_fist(card_id) {
        return (
        is_crash_fist(card_id));
    }
    get_debuff_count(idx) {
        const me = this.players[idx];
        let ret = 0;
        ret += me.decrease_atk;
        ret += me.internal_injury;
        ret += me.wound;
        ret += me.styx;
        ret += me.entangle;
        ret += me.flaw;
        ret += me.weaken;
        return ret;
    }
    just_do_the_card_and_nothing_else(card) {
        card.card_actions(this);
    }
    trigger_card(card_id, idx) {
        this.indent();
        const p0 = this.players[0];
        p0.trigger_depth += 1;
        const prev_triggering_idx = p0.currently_triggering_card_idx;
        const prev_triggering_id = p0.currently_triggering_card_id;
        const prev_bonus_rep_amt = p0.bonus_rep_amt;
        const prev_this_trigger_directly_attacked = p0.this_trigger_directly_attacked;
        let card = swogi[card_id];
        p0.currently_triggering_card_idx = idx;
        p0.currently_triggering_card_id = card_id;
        p0.bonus_rep_amt = 0;
        p0.this_trigger_directly_attacked = false;
        this.do_cloud_sword_softheart_and_friends(card_id);
        this.do_regenerating_body(idx);
        this.just_do_the_card_and_nothing_else(card);
        //card_actions[card_id](this);
        //this.do_action(card.actions);
        // expire crash fist buffs - they don't apply to extra attacks


        // Extra attacks zone
        // Endless sword formation seems to not trigger for cards that only attacked
        // because of hhh, Shocked, or Stance of Fierce Attack.
        // End of extra attacks zone


        p0.bonus_rep_amt = prev_bonus_rep_amt;
        p0.this_trigger_directly_attacked = prev_this_trigger_directly_attacked;
        p0.currently_triggering_card_idx = prev_triggering_idx;
        p0.currently_triggering_card_id = prev_triggering_id;
        p0.trigger_depth -= 1;
        this.unindent();
    }
    process_this_card_chases() {
        const me = this.players[0];
        // if we chased 1 or more times during this card, let's regard that as 1 chase for now...
        if (me.this_card_chases <= 0) {
            if (me.agility >= 10 && me.chases < me.max_chases) {
                me.this_card_chases += 1;
                me.agility -= 10;
                this.log("Spent 10 agility to chase. Agility is now " + me.agility);
            }
        }
        if (me.this_card_chases > 0 && me.chases < me.max_chases) {
            let do_entangle = (me.entangle > 0
            );
            if (do_entangle) {
                this.reduce_idx_x_by_c(0, "entangle", 1);
            } else {
                me.chases += 1;
                this.log("incremented chases to " + me.chases);
                if (me.surge_of_qi_stacks > 0 && !me.stance_is_fist) {
                    this.increase_idx_qi(0, 1);
                }
            }
        }
    }
    play_card_inner(card_id, idx) {
        const me = this.players[0];
        me.this_card_attacked = false;
        me.this_card_directly_attacked = false;
        this.trigger_card(card_id, idx);
        this.do_cloud_sword_chain_count(card_id);
    }
    play_card(card_id, idx) {
        const me = this.players[0];
        me.this_card_chases = 0;
        me.currently_playing_card_idx = idx;
        let plays = 1;
        for (let i=0; i<plays; i++) {
            this.play_card_inner(card_id, idx);
        }
        me.currently_playing_card_idx = undefined;
    }
    get_next_idx(idx) {
        const me = this.players[0];
        const len = me.cards.length;
        const incr = me.card_play_direction;
        idx = (idx + len + incr) % len;
        return idx;
    }
    get_prev_idx(idx) {
        const me = this.players[0];
        const len = me.cards.length;
        const incr = me.card_play_direction;
        idx = (idx + len - incr) % len;
        return idx;
    }
    get_next_playable_idx(idx) {
        const me = this.players[0];
        const len = me.cards.length;
        const incr = me.card_play_direction;
        for (let i=0; i<len; i++) {
            idx = (idx + len + incr) % len;
            if (me.can_play[idx]) {
                return idx;
            }
        }
    }
    advance_next_card_index() {
        const me = this.players[0];
        me.next_card_index = this.get_next_playable_idx(me.next_card_index);
    }
    can_play_a_card() {
        const me = this.players[0];
        return me.next_card_index < me.cards.length && me.can_play[me.next_card_index];
    }
    gain_qi_to_afford_card(gather_qi) {
        {
            this.increase_idx_qi(0, 1);
        }
    }
    do_def_decay() {
        // def lost is is def*def_decay / 100, rounded up
        const me = this.players[0];
        let def_decay = 50;
        this.for_each_x_reduce_c_pct_y("def", def_decay, "def");
    }
    do_regen() {
        const me = this.players[0];
        if (me.regen > 0) {
            this.heal(me.regen);
        }
    }
    do_internal_injury(idx, is_start_of_turn) {
        const me = this.players[idx];
        let amt = me.internal_injury;
        if (amt > 0) {
            this.reduce_idx_hp(idx, amt);
        }
    }
    do_meditation_of_xuan() {
        if (this.players[0].meditation_of_xuan_stacks === 0) {
            return;
        }
        this.for_each_x_add_y("meditation_of_xuan_stacks", "internal_injury");
        this.for_each_x_add_y("meditation_of_xuan_stacks", "regen");
    }
    do_skip_next_card() {
        const me = this.players[0];
    }
    sim_turn() {
        const me = this.players[0];
        const enemy = this.players[1];
        me.chases = 0;
        me.this_turn_attacked = false;
        this.do_def_decay();
        this.do_meditation_of_xuan();
        this.do_regen();
        this.do_internal_injury(0, true);
        if (this.check_for_death()) {
            return;
        }
        let action_idx = 0;
        let can_act = true;
        while (action_idx <= me.chases && action_idx <= me.max_chases && can_act) {
            if (this.check_for_death()) {
                return;
            }
            if (action_idx > 0) {
                this.log("chase!!");
            }
            action_idx += 1;
            if (!this.can_play_a_card()) {
                this.log("can't play any card :( converting slot 0 to normal");
                me.can_play[0] = true;
                me.next_card_index = 0;
                me.cards[0] = "601011";
            }
            this.do_skip_next_card();
            let card_id = me.cards[me.next_card_index];
            let card = swogi[card_id];
            let qi_cost = card.qi_cost;
            // TODO: ths has to get reworked for chengyun's fusion style.
            if (card.decrease_qi_cost_by_x !== undefined) {
                let x = card.decrease_qi_cost_by_x;
                let reduce_amt = 0;
                if (x === "debuff") {
                    reduce_amt = this.get_debuff_count(0);
                } else {
                    reduce_amt = me[x];
                }
                if (reduce_amt) {
                    qi_cost = Math.max(0, qi_cost - reduce_amt);
                }
            }
            let hp_cost = card.hp_cost;
            const orig_hp_cost = hp_cost;
            if (me.qi < qi_cost) {
                this.gain_qi_to_afford_card(card.gather_qi);
                this.log("player 0 gained qi instead of playing " + format_card(card_id) + ". They now have " + me.qi + "/" + qi_cost + " qi");
            } else {
                if (qi_cost > 0) {
                    this.reduce_idx_x_by_c(0, "qi", qi_cost);
                    this.log("player 0 spent " + qi_cost + " qi to play " + format_card(card_id));
                }
                if (hp_cost !== undefined) {
                    if (hp_cost > 0) {
                        {
                            this.reduce_idx_hp(0, hp_cost, true);
                        }
                    }
                    this.log("player 0 spent " + hp_cost + " hp to play " + format_card(card_id));
                    // bounce is consumed by spending 0 hp to play mountain cleaving palms
                    // but it is not used when paying hp via unbounded qi
                }
                if (hp_cost === undefined && qi_cost === 0) {
                    this.log("player 0 is playing " + format_card(card_id));
                }
                const card_idx = me.next_card_index;
                card_id = me.cards[card_idx];
                this.play_card(card_id, card_idx);
                if (this.check_for_death()) {
                    return;
                }
                this.log("player 0 finished playing " + card.name);
                this.advance_next_card_index();
                this.process_this_card_chases();
            }
        }
        if (this.check_for_death()) {
            return;
        }
        this.reduce_idx_x_by_c(0, "entangle", 1);
        this.reduce_idx_x_by_c(0, "flaw", 1);
        this.reduce_idx_x_by_c(0, "weaken", 1);
        if (this.check_for_death()) {
            return;
        }
    }
    reduce_idx_def(idx, amt) {
        if (amt < 0) {
            this.log("error: amt is negative: " + amt);
            this.crash();
        }
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        const reduced_amt = Math.min(amt, me.def);
        me.def -= reduced_amt;
        this.log("reduced player " + idx + " def by " + reduced_amt + " to " + me.def);
    }
    reduce_idx_hp(idx, dmg, is_cost, ignore_guard_up) {
        if (dmg < 0) {
            this.log("error: dmg is negative: " + dmg);
            this.crash();
        }
        if (dmg === 0) {
            return 0;
        }
        const me = this.players[idx];
        me.hp -= dmg;
        this.log("reduced player " + idx +" hp by " + dmg + " to " + me.hp);
        return dmg;
    }
    reduce_idx_max_hp(idx, amt) {
        if (amt < 0) {
            this.log("error: amt is negative: " + amt);
            this.crash();
        }
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        const reduced_amt = Math.min(amt, me.max_hp);
        me.max_hp -= reduced_amt;
        if (me.hp > me.max_hp) {
            this.log("reducing hp to max_hp of " + me.max_hp);
            me.hp = me.max_hp;
        }
        this.log("reduced player " + idx + " max_hp by " + amt + " to " + me.max_hp);
    }
    reduce_idx_force(idx, amt) {
        if (amt < 0) {
            this.log("error: amt is negative: " + amt);
            this.crash();
        }
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        if (me.force === 0) {
            return;
        }
        const reduced_amt = Math.min(amt, me.force);
        me.force -= reduced_amt;
        this.log("reduced player " + idx + " force by " + reduced_amt + " to " + me.force);
    }
    increase_idx_max_hp(idx, amt) {
        if (amt === 0) {
            return 0;
        }
        const me = this.players[idx];
        me.max_hp += amt;
        this.log("increased player " + idx + " max_hp by " + amt + " to " + me.max_hp);
    }
    increase_idx_hp(idx, amt, heal_while_dead) {
        const me = this.players[idx];
        if (amt === 0) {
            return 0;
        }
        const prev_hp = me.hp;
        if (prev_hp <= 0 && !heal_while_dead) {
            this.log("refusing to heal a dead player");
            return 0;
        }
        me.hp += amt;
        if (me.hp > me.max_hp) {
            {
                me.hp = me.max_hp;
            }
        }
        this.log("healed " + amt + " hp. Went from " + prev_hp + " to " + me.hp);
    }
    reduce_my_hp(dmg) {
        return this.reduce_idx_hp(0, dmg, false);
    }
    reduce_enemy_hp(dmg) {
        return this.reduce_idx_hp(1, dmg, false);
    }
    increase_my_hp(amt) {
        return this.increase_idx_hp(0, amt);
    }
    increase_enemy_hp(amt) {
        return this.increase_idx_hp(1, amt);
    }
    increase_idx_def(idx, amt) {
        const me = this.players[idx];
        if (amt === 0) {
            return;
        }
        me.def += amt;
        this.log("gained " + amt + " def. Now have " + me.def + " def");
    }
    increase_idx_penetrate(idx, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        me.penetrate += amt;
        this.log("gained " + amt + " penetrate. Now have " + me.penetrate + " penetrate");
    }
    increase_idx_qi(idx, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        me.qi += amt;
        this.log("gained " + amt + " qi. Now have " + me.qi + " qi");
    }
    increase_idx_force(idx, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        me.force += amt;
        if (me.force > me.max_force) {
            const excess_amt = me.force - me.max_force;
            me.force = me.max_force;
            this.increase_idx_def(idx, excess_amt);
        }
        if (me.surge_of_qi_stacks > 0 && me.stance_is_fist) {
            this.increase_idx_x_by_c(idx, "agility", 2);
        }
        this.log("gained " + amt + " force. Now have " + me.force + " force");
    }
    increase_idx_activate(idx, x, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        me[x] += amt;
        this.log("gained " + amt + " " + x + ". Now have " + me[x] + " " + x);
    }
    increase_idx_physique(idx, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        const prev = me.physique;
        me.physique += amt;
        me.physique_gained += amt;
        this.log("gained " + amt + " physique. Now have " + me.physique + " physique");
        this.increase_idx_max_hp(idx, amt);
        if (me.max_physique < me.physique) {
            let heal_amt = amt;
            if (prev < me.max_physique) {
                heal_amt -= me.max_physique - prev;
            }
            this.increase_idx_hp(idx, heal_amt);
        }
    }
    increase_idx_hexagram(idx, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        me.hexagram += amt;
        this.log("gained " + amt + " hexagram. Now have " + me.hexagram + " hexagram");
    }
    increase_idx_star_power(idx, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        me.star_power += amt;
        this.log("gained " + amt + " star power. Now have " + me.star_power + " star power");
    }
    increase_idx_debuff(idx, x, amt) {
        if (amt === 0) {
            return;
        }
        const me = this.players[idx];
        if (x === "styx") {
            if (me.character === "dx3") {
                this.increase_idx_hp(idx, amt * 3);
            } else {
                this.reduce_idx_hp(idx, amt * 3, false);
            }
        }
        me[x] += amt;
        this.log("gained " + amt + " " + x + ". Now have " + me[x] + " " + x);
    }
    increase_idx_x_by_c(idx, x, c) {
        if (c === 0) {
            return;
        }
        const me = this.players[idx];
        if (c < 0) {
            this.log("error: c is negative: " + c);
            this.crash();
        }
        if (x === "hp") {
            return this.increase_idx_hp(idx, c);
        }
        if (x === "physique") {
            return this.increase_idx_physique(idx, c);
        }
        if (is_debuff(x)) {
            return this.increase_idx_debuff(idx, x, c);
        }
        me[x] += c;
        this.log("gained " + c + " " + x + ". Now have " + me[x] + " " + x);
    }
    reduce_idx_x_by_c(idx, x, c) {
        if (c === 0) {
            return;
        }
        const me = this.players[idx];
        if (x === "hp") {
            return this.reduce_idx_hp(idx, c, false);
        }
        if (x === "max_hp") {
            return this.reduce_idx_max_hp(idx, c);
        }
        if (c < 0) {
            this.log("error: c is negative: " + c);
            this.crash();
        }
        const prev_x = me[x];
        me[x] -= c;
        if (me[x] < 0) {
            me[x] = 0;
        }
        if (prev_x !== me[x] || c !== 1) {
            this.log("lost " + c + " " + x + ". Now have " + me[x] + " " + x);
        }
    }
    deal_damage_inner(dmg, is_atk, my_idx, is_extra) {
        const enemy_idx = 1 - my_idx;
        let pct_multiplier = 100;
        let min_dmg = 1;
        const me = this.players[my_idx];
        const enemy = this.players[enemy_idx];
        if (is_atk) {
            me.this_atk_injured = false;
            if (me.trigger_depth <= 1) {
                me.this_card_directly_attacked = true;
            }
            me.this_trigger_directly_attacked = true;
            me.this_card_attacked = true;
            me.this_turn_attacked = true;
            dmg += me.increase_atk;
            if (!me.ignore_decrease_atk) {
                dmg -= me.decrease_atk;
            }
            me.ignore_decrease_atk = false;
            if (me.weaken > 0
                && !me.ignore_weaken
            ) {
                pct_multiplier -= 40;
            }
            me.ignore_weaken = false;
            if (enemy.flaw > 0) {
                pct_multiplier += 40;
            }
            me.bonus_force_amt = 0;
        }
        dmg = Math.floor(dmg * pct_multiplier / 100);
        dmg = Math.max(min_dmg, dmg);
        let damage_to_def = 0;
        let damage_to_hp = 0;
        {
            damage_to_def = Math.min(enemy.def, dmg);
            damage_to_hp = dmg - damage_to_def;
        }
        this.reduce_idx_def(enemy_idx, damage_to_def);
        let ignore_guard_up = false;
        if (is_atk) {
            let can_wound = damage_to_hp > 0;
            if (can_wound) {
                damage_to_hp += enemy.wound;
            }
        }
        let damage_actually_dealt_to_hp = this.reduce_idx_hp(
            enemy_idx, damage_to_hp, false, ignore_guard_up);
        if (is_atk) {
            me.damage_dealt_to_hp_by_atk = damage_actually_dealt_to_hp;
            if (damage_actually_dealt_to_hp > 0) {
                me.this_atk_injured = true;
            }
        }
    }
    deal_damage(dmg) {
        this.deal_damage_inner(dmg, false, 0);
    }
    atk(dmg, is_extra) {
        const me = this.players[0];
        const enemy = this.players[1];
        this.deal_damage_inner(dmg, true, 0, is_extra);
    }
    if_cloud_hit() {
        return (this.players[0].cloud_sword_chain_count > 0
        );
    }
    if_fist_stance() {
        return this.players[0].stance_is_fist;
    }
    if_stick_stance() {
        return !this.players[0].stance_is_fist;
    }
    switch_stance() {
        this.players[0].stance_is_fist = !this.players[0].stance_is_fist;
    }
    if_injured() {
        return this.players[0].this_atk_injured;
    }
    def(amt) {
        this.increase_idx_def(0, amt);
    }
    qi(amt) {
        this.increase_idx_qi(0, amt);
    }
    for_each_x_reduce_c_pct_y(x, c, y) {
        let to_lose = Math.ceil(this.players[0][x] * c / 100);
        to_lose = Math.max(0, to_lose);
        this.reduce_idx_x_by_c(0, y, to_lose);
    }
    for_each_idx_x_add_idx_c_pct_y(idx_a, x, idx_b, c, y) {
        let amt_x = 0;
        if (x === "debuff") {
            amt_x = this.get_debuff_count(idx_a);
        } else {
            amt_x = this.players[idx_a][x];
        }
        const to_gain = Math.floor(amt_x * c / 100);
        this.increase_idx_x_by_c(idx_b, y, to_gain);
    }
    for_each_x_add_c_pct_y(x, c, y) {
        let amt_x = 0;
        if (x === "debuff") {
            amt_x = this.get_debuff_count(0);
        } else {
            amt_x = this.players[0][x];
        }
        const to_gain = Math.floor(amt_x * c / 100);
        this.increase_idx_x_by_c(0, y, to_gain);
    }
    for_each_x_add_c_pct_y_up_to_d(x, c, y, d) {
        const to_gain = Math.min(d, Math.floor(this.players[0][x] * c / 100));
        this.increase_idx_x_by_c(0, y, to_gain);
    }
    for_each_x_add_c_y(x, c, y) {
        let amt_x = 0;
        if (x === "debuff") {
            amt_x = this.get_debuff_count(0);
        } else {
            amt_x = this.players[0][x];
        }
        const to_gain = c * amt_x;
        this.increase_idx_x_by_c(0, y, to_gain);
    }
    for_each_x_add_y(x, y) {
        let amt_x = 0;
        if (x === "debuff") {
            amt_x = this.get_debuff_count(0);
        } else {
            amt_x = this.players[0][x];
        }
        this.increase_idx_x_by_c(0, y, amt_x);
    }
    add_my_x_to_enemy_y(x, y) {
        this.increase_idx_x_by_c(1, y, this.players[0][x]);
    }
    exhaust_x(x) {
        const reduce_amt = this.players[0][x];
        this.reduce_idx_x_by_c(0, x, reduce_amt);
        return reduce_amt;
    }
    exhaust_x_to_add_y(x, y) {
        const reduce_amt = this.players[0][x];
        const gain_amt = reduce_amt;
        this.reduce_idx_x_by_c(0, x, reduce_amt);
        this.increase_idx_x_by_c(0, y, gain_amt);
    }
    exhaust_x_to_add_c_y(x, c, y) {
        const reduce_amt = this.players[0][x];
        const gain_amt = reduce_amt * c;
        this.reduce_idx_x_by_c(0, x, reduce_amt);
        this.increase_idx_x_by_c(0, y, gain_amt);
    }
    heal(amt) {
        this.increase_idx_hp(0, amt);
    }
    chase() {
        this.increase_idx_x_by_c(0, "this_card_chases", 1);
    }
    reduce_enemy_c_of_x(c, x) {
        this.reduce_idx_x_by_c(1, x, c);
    }
    reduce_enemy_x_by_c_pct_enemy_y(x, c, y) {
        const to_lose = Math.ceil(this.players[1][y] * c / 100);
        this.reduce_idx_x_by_c(1, x, to_lose);
    }
    reduce_enemy_x_by_enemy_y(x, y) {
        this.reduce_idx_x_by_c(1, x, this.players[1][y]);
    }
    add_enemy_c_of_x(c, x) {
        this.increase_idx_x_by_c(1, x, c);
    }
    continuous() {
        if (this.players[0].trigger_depth === 1) {
            this.players[0].can_play[this.players[0].currently_playing_card_idx] = false;
        }
    }
    consumption() {
        if (this.players[0].trigger_depth === 1) {
            this.players[0].can_play[this.players[0].currently_playing_card_idx] = false;
        }
    }
    exhaust() {
        if (this.players[0].trigger_depth === 1) {
            this.players[0].can_play[this.players[0].currently_playing_card_idx] = false;
        }
    }
    add_c_of_x(c, x) {
        this.increase_idx_x_by_c(0, x, c);
    }
    reduce_c_of_x(c, x) {
        this.reduce_idx_x_by_c(0, x, c);
    }
    for_each_x_up_to_c_add_y(x, c, y) {
        let amt_to_add = Math.min(c, this.players[0][x]);
        this.add_c_of_x(amt_to_add, y);
    }
    retrigger_previous_sword_formation() {
        const my_idx = this.players[0].currently_triggering_card_idx;
        const step = -this.players[0].card_play_direction;
        let idx = my_idx + step;
        while (idx >= 0 && idx < this.players[0].cards.length) {
            const card_id = this.players[0].cards[idx];
            if (this.is_sword_formation(card_id)) {
                this.log("retriggering " + format_card(card_id));
                this.trigger_card(card_id, idx);
                return;
            }
            idx += step;
        }
    }
    retrigger_next_opening(step_multiplier, n_cards, reps_per_card) {
        const my_idx = this.players[0].currently_triggering_card_idx;
        const step = this.players[0].card_play_direction * step_multiplier;
        let idx = my_idx + step;
        while (idx >= 0 && idx < this.players[0].cards.length && n_cards > 0) {
            const card_id = this.players[0].cards[idx];
            const opening = swogi[card_id].opening;
            if (opening !== undefined) {
                n_cards -= 1;
                for (let i=0; i<reps_per_card; i++) {
                    this.do_opening(idx, my_idx);
                }
            }
            idx += step;
        }
    }
    // the reason this wouldn't just use `rep` is that we'd like to
    // detect whether the game outcome actually depends on randomness.
    // in cases where the player has 2 debuffs and this effect clears
    // both, it's not really random - the order doesn't matter.
    reduce_random_debuff_by_c_n_times(c,n) {
        if (n === 0) {
            return;
        }
        let my_debuff_names = [];
        let my_debuff_stack_counts = [];
        let necessary_times = 0;
        const me = this.players[0];
        for (let i=0; i<DEBUFF_NAMES.length; i++) {
            if (me[DEBUFF_NAMES[i]] > 0) {
                my_debuff_names.push(DEBUFF_NAMES[i]);
                my_debuff_stack_counts.push(me[DEBUFF_NAMES[i]]);
                necessary_times += Math.ceil(me[DEBUFF_NAMES[i]] / c);
            }
        }
        if (necessary_times > n && my_debuff_names.length > 1) {
            this.used_randomness = true;
        }
        for (let i=0; i<n; i++) {
            // pick a random debuff we have.
            // reduce it by c
            // if it's 0, remove it from the list of debuffs we have
            if (my_debuff_names.length === 0) {
                break;
            }
            /*
            // if internal injury is active, reduce it by c
            if (me.internal_injury > 0) {
                this.reduce_idx_x_by_c(0, "internal_injury", c);
                // get the index of internal injury
                const debuff_idx = my_debuff_names.indexOf("internal_injury");
                if (me.internal_injury === 0) {
                    my_debuff_names.splice(debuff_idx, 1);
                    my_debuff_stack_counts.splice(debuff_idx, 1);
                }
                continue;
            }
            // if flaw is active, reduce it by c
            if (me.flaw > 0) {
                this.reduce_idx_x_by_c(0, "flaw", c);
                // get the index of flaw
                const debuff_idx = my_debuff_names.indexOf("flaw");
                if (me.flaw === 0) {
                    my_debuff_names.splice(debuff_idx, 1);
                    my_debuff_stack_counts.splice(debuff_idx, 1);
                }
                continue;
            }
            */
            let debuff_idx = Math.floor(Math.random() * my_debuff_names.length);
            let debuff_name = my_debuff_names[debuff_idx];
            this.reduce_idx_x_by_c(0, debuff_name, c);
            if (me[debuff_name] === 0) {
                my_debuff_names.splice(debuff_idx, 1);
                my_debuff_stack_counts.splice(debuff_idx, 1);
            }
        }
    }
    transfer_random_debuff() {
        let my_debuff_names = [];
        const me = this.players[0];
        for (let i=0; i<DEBUFF_NAMES.length; i++) {
            if (me[DEBUFF_NAMES[i]] > 0) {
                my_debuff_names.push(DEBUFF_NAMES[i]);
            }
        }
        if (my_debuff_names.length === 0) {
            return;
        }
        if (my_debuff_names.length > 1) {
            this.used_randomness = true;
        }
        let debuff_idx = Math.floor(Math.random() * my_debuff_names.length);
        let debuff_name = my_debuff_names[debuff_idx];
        this.reduce_idx_x_by_c(0, debuff_name, 1);
        this.increase_idx_debuff(1, debuff_name, 1);
    }
    is_fake_unrestrained_sword(card_id) {
        let ret = false;
        const me = this.players[0];
        if (this.players[0].chengyuns_fusion_style_stacks > 0) {
            const card_id_without_level = card_id.substring(0, card_id.length - 1);
            ret ||= this.players[0].swordplay_talent_cards.includes(card_id_without_level);
        }
        return ret;
    }
    is_fake_cloud_sword(card_id) {
        let ret = false;
        ret ||= (swogi[card_id].name === "Clear Heart Sword Embryo" &&
            this.players[0].quench_of_sword_heart_cloud_stacks > 0)
        if (this.players[0].chengyuns_fusion_style_stacks > 0) {
            const card_id_without_level = card_id.substring(0, card_id.length - 1);
            ret ||= this.players[0].swordplay_talent_cards.includes(card_id_without_level);
        }
        return ret;
    }
    ignore_weaken() {
        this.players[0].ignore_weaken = true;
    }
    ignore_decrease_atk() {
        this.players[0].ignore_decrease_atk = true;
    }
    check_for_death() {
        const me = this.players[0];
        const enemy = this.players[1];
        while (me.hp <= 0 ||
            me.destiny <= 0 ||
            enemy.hp <= 0 ||
            enemy.destiny <= 0) {
            this.check_idx_for_death(0);
            this.check_idx_for_death(1);
            if (this.game_over) {
                return true;
            }
        }
        return false;
    }
    check_idx_for_death(idx) {
        const me = this.players[idx];
        if (me.destiny <= 0) {
            me.hp = 0;
            this.game_over = true;
            this.log("player " + idx + " has died of destiny loss");
            return true;
        }
        while (me.hp <= 0) {
            {
                this.game_over = true;
                this.log("player " + idx + " has died of hp loss");
                return true;
            }
        }
        return false;
    }
    set_c_up_to_x(c, x) {
        const current_value = this.players[0][x];
        if (current_value < c) {
            this.increase_idx_x_by_c(0, x, c - current_value);
        }
    }
    set_enemy_c_up_to_x(c, x) {
        const current_value = this.players[1][x];
        if (current_value < c) {
            this.increase_idx_x_by_c(1, x, c - current_value);
        }
    }
    set_c_of_x(c, x) {
        const current_value = this.players[0][x];
        if (current_value > c) {
            this.reduce_idx_x_by_c(0, x, current_value - c);
        } else if (current_value < c) {
            this.increase_idx_x_by_c(0, x, c - current_value);
        }
    }
    set_idx_c_of_x(idx, c, x) {
        const current_value = this.players[idx][x];
        if (current_value > c) {
            this.reduce_idx_x_by_c(idx, x, current_value - c);
        } else if (current_value < c) {
            this.increase_idx_x_by_c(idx, x, c - current_value);
        }
    }
    trigger_hexagram(idx) {
        if (this.players[idx].hexagram > 0) {
            this.reduce_idx_x_by_c(idx, "hexagram", 1);
            return true;
        }
        return false;
    }
    rand_range(lo_inclusive, hi_inclusive) {
        if (this.trigger_hexagram(0)) {
            return hi_inclusive;
        }
        this.used_randomness = true;
        const extent = hi_inclusive - lo_inclusive + 1;
        return lo_inclusive + Math.floor(Math.random() * extent);
    }
    trigger_random_sect_card() {
        this.used_randomness = true;
        //TODO: this.
    }
    trigger_random_unrestrained_card() {
        this.used_randomness = true;
        //TODO: this.
    }
    do_endless_crash(upgrade_level) {
        this.used_randomness = true;
        const arr = CRASH_FIST_CARDS[upgrade_level];
        const playing_idx = this.players[0].currently_playing_card_idx;
        for (let i=0; i<5; i++) {
            const crash_idx = Math.floor(Math.random() * arr.length);
            const card_id = arr[crash_idx];
            this.log("triggering " + format_card(card_id));
            this.trigger_card(card_id, playing_idx);
        }
    }
    do_clear_heart() {
        const ult = (0
        );
        let first_atk_damage = 6 + Math.min(this.players[0].round_number, 19);
        first_atk_damage -= 8 * this.players[0].quench_of_sword_heart_cloud_stacks;
        first_atk_damage += ult;
        // do the first atk
        this.atk(first_atk_damage);
        // next cloud sword chases if we picked cloud
        this.players[0].cloud_sword_clear_heart_stacks += this.players[0].quench_of_sword_heart_cloud_stacks;
    }
    do_clear_heart_sword_formation(first_atk_damage) {
        const first_def_amt = first_atk_damage;
        // do the first atk
        this.atk(first_atk_damage);
        this.increase_idx_def(0, first_def_amt);
    }
    if_c_pct(c) {
        if (this.trigger_hexagram(0)) {
            return true;
        }
        this.used_randomness = true;
        return Math.random() < c / 100;
    }
    do_fire_spirit_blazing_praerie(amt) {
        const enemy = this.players[1];
        const desired_max_hp = enemy.hp - amt;
        const reduce_amt = Math.max(0, enemy.max_hp - desired_max_hp);
        this.reduce_idx_max_hp(1, reduce_amt);
    }
    for_each_x_reduce_enemy_c_y(x, c, y) {
        let to_lose = this.players[0][x] * c;
        this.reduce_enemy_c_of_x(to_lose, y);
    }
    physique(amt) {
        this.increase_idx_physique(0, amt);
    }
    set_x_down_to_c(x, c) {
        if (this.players[0][x] > c) {
            this.reduce_idx_x_by_c(0, x, this.players[0][x] - c);
        }
    }
    do_echo_formation_thing(upgrade_amt) {
        const first_slot_id = this.players[0].cards[0];
        if (swogi[first_slot_id].is_continuous) {
            const existing_upgrade_level = first_slot_id.substring(first_slot_id.length-1);
            const new_upgrade_level = Math.min(3, parseInt(existing_upgrade_level) + upgrade_amt);
            const new_card_id = first_slot_id.substring(0, first_slot_id.length-1) + new_upgrade_level;
            this.log("triggering " + format_card(new_card_id));
            this.trigger_card(new_card_id, this.players[0].currently_playing_card_idx);
        }
    }
    cards_have_generating_interaction(id1, id2) {
        if (id1 === undefined || id2 === undefined) {
            return false;
        }
        const c1 = swogi[id1];
        const c2 = swogi[id2];
        if (c1.is_wood_spirit) {
            return c2.is_fire_spirit;
        }
        if (c1.is_fire_spirit) {
            return c2.is_earth_spirit;
        }
        if (c1.is_earth_spirit) {
            return c2.is_metal_spirit;
        }
        if (c1.is_metal_spirit) {
            return c2.is_water_spirit;
        }
        if (c1.is_water_spirit) {
            return c2.is_wood_spirit;
        }
        return false;
    }
    cards_have_overcoming_interaction(id1, id2) {
        for (let i=1; i<10; i+=2) {
            const mid = "1310" + i + "1";
            if (this.cards_have_generating_interaction(id1, mid) &&
                this.cards_have_generating_interaction(mid, id2)) {
                return true;
            }
        }
        return false;
    }
    activate_element_of_card(id) {
        let activated = false;
        const card = swogi[id];
        if (card.is_wood_spirit) {
            this.activate_wood_spirit();
            activated = true;
        }
        if (card.is_fire_spirit) {
            this.activate_fire_spirit();
            activated = true;
        }
        if (card.is_earth_spirit) {
            this.activate_earth_spirit();
            activated = true;
        }
        if (card.is_metal_spirit) {
            this.activate_metal_spirit();
            activated = true;
        }
        if (card.is_water_spirit) {
            this.activate_water_spirit();
            activated = true;
        }
        return activated;
    }
    do_five_elements_circulation(upgrade_level) {
        let idx = this.players[0].currently_playing_card_idx;
        const prev_idx = this.get_prev_idx(idx);
        const next_idx = this.get_next_idx(idx);
        const prev_id = this.players[0].cards[prev_idx];
        const next_id = this.players[0].cards[next_idx];
        if (this.cards_have_generating_interaction(prev_id, next_id)) {
            this.activate_element_of_card(next_id);
            const next_upgrade_level = parseInt(next_id.substring(next_id.length-1));
            upgrade_level = Math.min(upgrade_level, next_upgrade_level);
            const new_id = next_id.substring(0, next_id.length-1) + upgrade_level;
            this.log("triggering " + format_card(new_id));
            this.trigger_card(new_id, idx);
        }
    }
    do_frozen_blood_lotus(times) {
        for (let i=0; i<times; i++) {
            let amt = 10;
            if (this.players[0].hp <= 10) {
                amt = this.players[0].hp - 1;
            }
            this.reduce_idx_x_by_c(0, "hp", amt);
        }
        this.increase_idx_x_by_c(0, "guard_up", times);
    }
    reverse_card_play_direction() {
        this.players[0].card_play_direction *= -1;
    }
    idx_has_debuff(idx) {
        const me = this.players[idx];
        if (me.internal_injury > 0) return true;
        if (me.weaken > 0) return true;
        if (me.flaw > 0) return true;
        if (me.decrease_atk > 0) return true;
        if (me.entangle > 0) return true;
        if (me.wound > 0) return true;
        if (me.styx > 0) return true;
    }
    if_no_debuff() {
        return !this.idx_has_debuff(0);
    }
    if_enemy_has_debuff() {
        return this.idx_has_debuff(1);
    }
    do_qi_corrupting_sunflower() {
        const desired_qi_reduction = 3;
        const qi_reduction = Math.min(desired_qi_reduction, this.players[1].qi);
        const damage = (desired_qi_reduction - qi_reduction) * 5;
        this.reduce_idx_x_by_c(1, "qi", qi_reduction);
        if (damage > 0) {
            this.deal_damage(damage);
        }
    }
    do_qi_seeking_sunflower() {
        let amt = 4;
        if (this.players[0].qi > 0 || this.players[1].qi > 0) {
            amt += 2;
        }
        this.increase_idx_qi(0, amt);
    }
    reduce_enemy_max_hp(amt) {
        this.reduce_idx_x_by_c(1, "max_hp", amt);
    }
    def_rand_range(lo_inclusive, hi_inclusive) {
        const amt = this.rand_range(lo_inclusive, hi_inclusive);
        this.increase_idx_def(0, amt);
    }
    atk_rand_range(lo_inclusive, hi_inclusive) {
        const amt = this.rand_range(lo_inclusive, hi_inclusive);
        this.atk(amt);
    }
    reduce_enemy_max_hp_rand_range(lo_inclusive, hi_inclusive) {
        const amt = this.rand_range(lo_inclusive, hi_inclusive);
        this.reduce_enemy_max_hp(amt);
    }
    heal_rand_range(lo_inclusive, hi_inclusive) {
        const amt = this.rand_range(lo_inclusive, hi_inclusive);
        this.heal(amt);
    }
    deal_damage_rand_range(lo_inclusive, hi_inclusive) {
        const amt = this.rand_range(lo_inclusive, hi_inclusive);
        this.deal_damage(amt);
    }
    if_either_has_def() {
        return this.players[0].def > 0 || this.players[1].def > 0;
    }
    if_any_element_activated() {
        const me = this.players[0];
    }
    trigger_card_by_id(id) {
        this.trigger_card(id, this.players[0].currently_playing_card_idx);
    }
    do_five_elements_escape(def) {
        this.increase_idx_def(0, def);
        let activated = 0;
        const me = this.players[0];
        if (activated >= 2) {
            this.chase();
        }
    }
    for_each_enemy_x_add_y(x, y) {
        let amt_x = 0;
        if (x === "debuff") {
            amt_x = this.get_debuff_count(1);
        } else {
            amt_x = this.players[1][x];
        }
        this.add_c_of_x(amt_x, y);
    }
    do_sun_and_moon_for_glory(atk_amt, multiplier) {
        const hp_diff = this.players[0].max_hp - this.players[1].max_hp;
        if (hp_diff > 0) {
            atk_amt += Math.floor(hp_diff * multiplier);
        }
        this.deal_damage(atk_amt);
    }
    add_enemy_rand_range_of_x(lo_inclusive, hi_inclusive, x) {
        const amt = this.rand_range(lo_inclusive, hi_inclusive);
        this.add_enemy_c_of_x(amt, x);
    }
    set_enemy_c_of_x(c, x) {
        const current_value = this.players[1][x];
        if (current_value > c) {
            this.reduce_enemy_c_of_x(current_value - c, x);
        } else if (current_value < c) {
            this.add_enemy_c_of_x(c - current_value, x);
        }
    }
    do_fury_thunder(flaw_amt) {
        this.add_enemy_c_of_x(flaw_amt, "flaw");
        const me = this.players[0];
        const next_idx = this.get_next_playable_idx(me.currently_playing_card_idx);
        const next_id = me.cards[next_idx];
        if (is_thunder(next_id)) {
            this.chase();
        }
    }
    do_overcome_with_each_other(qi_amt, def_amt) {
        this.increase_idx_qi(0, qi_amt);
        this.increase_idx_def(0, def_amt);
        const me = this.players[0];
        const prev_idx = this.get_prev_idx(me.currently_playing_card_idx);
        const next_idx = this.get_next_idx(me.currently_playing_card_idx);
        const prev_id = me.cards[prev_idx];
        const next_id = me.cards[next_idx];
        if (this.cards_have_overcoming_interaction(prev_id, next_id)) {
            this.activate_element_of_card(next_id);
            this.chase();
        }
    }
    downgrade_enemy_card_or_deal_damage(dmg_amt) {
        const idx = this.players[0].currently_triggering_card_idx;
        if (!this.try_downgrade_card(1, idx)) {
            this.deal_damage(dmg_amt);
        }
    }
    is_unrestrained_sword(card_id) {
        const card = swogi[card_id];
        if (card.is_unrestrained_sword) {
            return true;
        }
        if (this.is_fake_unrestrained_sword(card_id)) {
            return true;
        }
        return false;
    }
    is_cloud_sword(card_id) {
        const card = swogi[card_id];
        if (card.is_cloud_sword) {
            return true;
        }
        if (this.is_fake_cloud_sword(card_id)) {
            return true;
        }
        return false;
    }
    is_sword_formation(card_id) {
        const card = swogi[card_id];
        let ret = false;
        ret ||= card.is_sword_formation;
        if (this.players[0].chengyuns_fusion_style_stacks > 0) {
            const card_id_without_level = card_id.substring(0, card_id.length - 1);
            ret ||= this.players[0].swordplay_talent_cards.includes(card_id_without_level);
        }
        return ret;
    }
    is_spirit_sword(card_id) {
        const card = swogi[card_id];
        let ret = false;
        ret ||= card.is_spirit_sword;
        if (this.players[0].chengyuns_fusion_style_stacks > 0) {
            const card_id_without_level = card_id.substring(0, card_id.length - 1);
            ret ||= this.players[0].swordplay_talent_cards.includes(card_id_without_level);
        }
        return ret;
    }
    for_each_x_convert_c_pct_debuff_to_y(x, c, y) {
        let debuff_amt = this.get_debuff_count(0);
        let c_pct_x = Math.floor(this.players[0][x] * c / 100);
        let convert_amt = Math.min(debuff_amt, c_pct_x);
        this.reduce_random_debuff_by_c_n_times(1, convert_amt);
        /*
        // first reduce weaken
        let weaken_amt = Math.min(this.players[0].weaken, convert_amt);
        let other_amt = convert_amt - weaken_amt;
        this.reduce_c_of_x(weaken_amt, "weaken");
        // then reduce decrease_atk
        const keep_decrease_atk_amt = 1;
        const max_decrease_atk_reduction = Math.max(this.players[0].decrease_atk - keep_decrease_atk_amt, 0);
        let decrease_atk_amt = Math.min(max_decrease_atk_reduction, other_amt);
        other_amt -= decrease_atk_amt;
        this.reduce_c_of_x(decrease_atk_amt, "decrease_atk");
        // then reduce internal injury
        let internal_injury_amt = Math.min(this.players[0].internal_injury, other_amt);
        other_amt -= internal_injury_amt;
        this.reduce_c_of_x(internal_injury_amt, "internal_injury");
        this.reduce_random_debuff_by_c_n_times(1, other_amt);
        /**/
        this.add_c_of_x(convert_amt, y);
    }
    trigger_next_enemy_card() {
        const idx = this.players[1].next_card_index;
        const card_id = this.players[1].cards[idx];
        this.log("triggering enemy card: " + format_card(card_id));
        this.trigger_card(card_id, this.players[0].currently_triggering_card_idx);
    }
    trigger_next_card() {
        let idx = this.players[0].currently_playing_card_idx;
        const next_idx = this.get_next_idx(idx);
        const next_id = this.players[0].cards[next_idx];
        this.log("triggering " + format_card(next_id));
        this.trigger_card(next_id, idx);
    }
    trigger_previous_card() {
        let idx = this.players[0].currently_playing_card_idx;
        const prev_idx = this.get_prev_idx(idx);
        const prev_id = this.players[0].cards[prev_idx];
        this.log("triggering " + format_card(prev_id));
        this.trigger_card(prev_id, idx);
    }
    do_xuanming_requiem_fulu(my_hp_loss_pct, fixed_hp_loss) {
        const my_hp_loss = Math.ceil(this.players[0].hp * my_hp_loss_pct / 100);
        this.reduce_idx_hp(0, my_hp_loss);
        this.reduce_enemy_hp(my_hp_loss + fixed_hp_loss);
        this.reduce_enemy_max_hp(my_hp_loss + fixed_hp_loss);
    }
    do_resonance_setup(idx) {
        const me = this.players[idx];
        const round_number = me.round_number;
    }
    do_normal_attack(atk_amt) {
        const me = this.players[0];
        let rep_amt = 1;
        for (let i = 0; i < rep_amt; i++) {
            this.atk(atk_amt);
        }
    }
    random_int(n) {
        this.used_randomness = true;
        return Math.floor(Math.random() * n);
    }
    spirit_sword_deck_count(max_n) {
        const me = this.players[0];
        let n = 0;
        for (let i=0; i<me.cards.length; i++) {
            if (this.is_spirit_sword(me.cards[i])) {
                n += 1;
            }
        }
        return Math.min(n, max_n);
    }
    sword_formation_deck_count(max_n) {
        const me = this.players[0];
        let n = 0;
        for (let i=0; i<me.cards.length; i++) {
            if (this.is_sword_formation(me.cards[i])) {
                n += 1;
            }
        }
        return Math.min(n, max_n);
    }
}

const FATE_TO_CHARACTER_OR_SECT = {
    sword_in_sheathed_stacks: "sw1",
    endurance_as_cloud_sea_stacks: "sw1",
    fire_flame_blade_stacks: "sw2",
    drift_ice_blade_stacks: "sw2",
    coral_sword_stacks: "sw3",
    lithe_as_cat_stacks: "sw4",
    blade_forging_sharpness_stacks: "sw5",
    blade_forging_stable_stacks: "sw5",
    sword_pattern_carving_chain_attack_stacks: "sw5",
    sword_pattern_carving_charge_stacks: "sw5",
    sword_pattern_carving_intense_stacks: "sw5",
    qi_forging_spiritage_stacks: "sw5",
    qi_forging_spiritstat_stacks: "sw5",
    qi_forging_spiritual_power_stacks: "sw5",
    quench_of_sword_heart_unrestrained_stacks: "sw5",
    quench_of_sword_heart_cloud_stacks: "sw5",
    quench_of_sword_heart_ultimate_stacks: "sw5",
    p4_mad_obsession_stacks: "sw",
    p5_mad_obsession_stacks: "sw",
    p2_rule_of_the_cloud_stacks: "sw",
    p3_rule_of_the_cloud_stacks: "sw",
    p4_rule_of_the_cloud_stacks: "sw",
    p5_rule_of_the_cloud_stacks: "sw",
    p2_sword_rhyme_cultivate_stacks: "sw",
    p3_sword_rhyme_cultivate_stacks: "sw",
    p4_sword_rhyme_cultivate_stacks: "sw",
    p5_sword_rhyme_cultivate_stacks: "sw",
    p2_sword_formation_guard_stacks: "sw",
    p3_sword_formation_guard_stacks: "sw",
    p4_sword_formation_guard_stacks: "sw",
    p5_sword_formation_guard_stacks: "sw",
    birdie_wind_stacks: "he1",
    astrology_stacks: "he4",
    heptastar_soulstat_stacks: "he4",
    astral_divination_hexagram_stacks: "he4",
    star_moon_folding_fan_stacks: "he5",
    act_underhand_stacks: "he5",
    rest_and_outwit_stacks: "he5",
    p2_divination_stacks: "he",
    p3_divination_stacks: "he",
    p4_divination_stacks: "he",
    p5_divination_stacks: "he",
    p2_stargaze_stacks: "he",
    p3_stargaze_stacks: "he",
    p4_stargaze_stacks: "he",
    p5_stargaze_stacks: "he",
    p2_astral_eclipse_stacks: "he",
    p3_astral_eclipse_stacks: "he",
    p4_astral_eclipse_stacks: "he",
    p5_astral_eclipse_stacks: "he",
    p2_post_strike_stacks: "he",
    p3_post_strike_stacks: "he",
    p4_post_strike_stacks: "he",
    p5_post_strike_stacks: "he",
    p2_rejuvenation_stacks: "he",
    p3_rejuvenation_stacks: "he",
    p4_rejuvenation_stacks: "he",
    p5_rejuvenation_stacks: "he",
    fire_spirit_generation_stacks: "fe5",
    flame_soul_rebirth_stacks: "fe5",
    five_elements_explosion_stacks: "fe5",
    swift_burning_seal_stacks: "fe5",
    five_elements_pure_vase_stacks: "fe6",
    herbs_flourish_stacks: "fe6",
    five_elements_gather_qi_stacks: "fe6",
    mark_of_five_elements_stacks: "fe1",
    innate_wood_stacks: "fe2",
    innate_fire_stacks: "fe2",
    innate_earth_stacks: "fe2",
    innate_metal_stacks: "fe2",
    innate_water_stacks: "fe2",
    innate_mark_stacks: "fe2",
    five_elements_anima_stacks: "fe2",
    peach_branch_ruyi_stacks: "fe3",
    mark_of_water_spirit_stacks: "fe3",
    blossom_dance_stacks: "fe3",
    the_body_of_fierce_tiger_stacks: "fe4",
    p2_cycle_of_five_elements_stacks: "fe",
    p3_cycle_of_five_elements_stacks: "fe",
    p4_cycle_of_five_elements_stacks: "fe",
    p5_cycle_of_five_elements_stacks: "fe",
    p2_mutual_growth_stacks: "fe",
    p3_mutual_growth_stacks: "fe",
    p4_mutual_growth_stacks: "fe",
    p5_mutual_growth_stacks: "fe",
    p2_concentrated_element_stacks: "fe",
    p3_concentrated_element_stacks: "fe",
    p4_concentrated_element_stacks: "fe",
    p5_concentrated_element_stacks: "fe",
    unbounded_qi_stacks: "dx1",
    unwavering_soul_stacks: "dx1",
    courage_to_fight_stacks: "dx2",
    cracking_fist_stacks: "dx2",
    stance_of_fierce_attack_stacks: "dx2",
    entering_styx_stacks: "dx3",
    zen_mind_forging_body_stacks: "dx4",
    mind_body_resonance_stacks: "dx4",
    p2_firmness_body_stacks: "dx",
    p3_firmness_body_stacks: "dx",
    p4_firmness_body_stacks: "dx",
    p5_firmness_body_stacks: "dx",
    p2_regenerating_body_stacks: "dx",
    p3_regenerating_body_stacks: "dx",
    p4_regenerating_body_stacks: "dx",
    p5_regenerating_body_stacks: "dx",
    p2_full_of_force_stacks: "dx",
    p3_full_of_force_stacks: "dx",
    p4_full_of_force_stacks: "dx",
    p5_full_of_force_stacks: "dx",
    p2_mark_of_dark_heart_stacks: "dx",
    p3_mark_of_dark_heart_stacks: "dx",
    p4_mark_of_dark_heart_stacks: "dx",
    p5_mark_of_dark_heart_stacks: "dx",
}

export function guess_character(player) {
    const character_id_to_guess_count = {};
    const sect_id_to_guess_count = {};
    for (let id in CHARACTER_ID_TO_NAME) {
        character_id_to_guess_count[id] = 0;
    }
    for (let i=0; i<SECTS.length; i++) {
        sect_id_to_guess_count[SECTS[i]] = 0;
    }
    for (let i=0; i<player.cards.length; i++) {
        const card_id = player.cards[i];
        const character = swogi[card_id].character;
        if (character) {
            character_id_to_guess_count[character]++;
            const sect = character.substring(0, 2);
            sect_id_to_guess_count[sect]++;
        } else {
            const marking = swogi[card_id].marking;
            if (sect_id_to_guess_count[marking] !== undefined) {
                sect_id_to_guess_count[marking] += 0.01
            }
        }
    }
    for (let id in FATE_TO_CHARACTER_OR_SECT) {
        if (player[id] > 0) {
            const character_or_sect = FATE_TO_CHARACTER_OR_SECT[id];
            if (character_or_sect.length === 2) {
                sect_id_to_guess_count[character_or_sect]++;
            } else {
                character_id_to_guess_count[character_or_sect]++;
                const sect = character_or_sect.substring(0, 2);
                sect_id_to_guess_count[sect]++;
            }
        }
    }
    // if any character has nonzero count, return the first such character
    // with the highest count
    let max_character_count = 0;
    let max_character_id = "";
    for (let id in character_id_to_guess_count) {
        if (character_id_to_guess_count[id] > max_character_count) {
            max_character_count = character_id_to_guess_count[id];
            max_character_id = id;
        }
    }
    if (max_character_count > 0) {
        return max_character_id;
    }
    // return the first character belonging to
    // the first sect with the highest count
    let max_sect_count = -1;
    let max_sect_id = "";
    for (let id in sect_id_to_guess_count) {
        if (sect_id_to_guess_count[id] > max_sect_count) {
            max_sect_count = sect_id_to_guess_count[id];
            max_sect_id = id;
        }
    }
    return max_sect_id + "1";
}

