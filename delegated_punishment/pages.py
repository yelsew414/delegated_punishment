from ._builtin import Page, WaitPage
import json, math
from otree.api import Currency as c, currency_range
from .models import Constants, DefendToken, Player
from random import random
from json import JSONEncoder


class Game(Page):
    timeout_seconds = 240 #todo look into this and consider adding script on front end to get it working dynamically
    #https://stackoverflow.com/questions/3768895/how-to-make-a-class-json-serializable
    def vars_for_template(self):

        # pp = Player.objects.get(pk=1)
        # import pdb;
        # pdb.set_trace()

        #  todo: we need to query player here since a blank model is being created instead
        #   of pulling from db. This is required to load data from the database.

        pjson = dict()
        pjson['player'] = self.player.pk
        pjson['map'] = self.player.map
        pjson['x'] = self.player.x
        pjson['y'] = self.player.y
        pjson['harvest_screen'] = self.player.harvest_screen

        vars_dict = dict()
        vars_dict['pjson'] = json.dumps(pjson)
        vars_dict['rand'] = str(random() * 1000)  # todo: remove
        if self.player.id_in_group == 1:
            officer_tokens = DefendToken.objects.filter(group=self.group)
            # for o in officer_tokens:
                # print("TOKEN {} - MAP  {} - X {:6.2f} - Y {:6.2f}".format(o.number, str(o.map), o.x, o.y)) #todo: these values are correct. Why are they not getting passed down to client?
            results = [obj.to_dict() for obj in officer_tokens]
            vars_dict['dtokens'] = json.dumps(results)

        return vars_dict


class Wait(WaitPage):
    pass


class ResultsWaitPage(WaitPage):
    def after_all_players_arrive(self):
        # todo make sure that we are not doing this 5 times!
        self.group.generate_results()

        for player in self.group.get_players():
            player.participant.vars['balances'].append(math.floor(player.balance))


class ResultsPage(Page):
    timeout_seconds = 10
    timer_text = 'Time remaining on results page'

    def vars_for_template(self):
        vars_dict = dict()
        vars_dict['period'] = self.player.subsession.round_number
        vars_dict['steal_total'] = self.player.steal_total
        vars_dict['victim_total'] = self.player.victim_total
        vars_dict['balance'] = math.floor(self.player.balance)
        return vars_dict


class Intermission(Page):
    timeout_seconds = 120
    timer_text = 'Please wait for round to start'

    def is_displayed(self):
        if self.round_number == 5 or self.round_number == 1:
            return True
        else:
            return False

    def vars_for_template(self):
        vars_dict = dict(
            steal_rate=Constants.civilian_steal_rate,
            fine=Constants.civilian_fine_amount,
            officer_bonus=self.group.officer_bonus,
            officer_reprimand=Constants.officer_reprimand_amount
        )
        return vars_dict


class AutoAdvancePage(Page):
    """This page is for after the tutorial and the practice period so that
    the next periods are not started automatically"""
    def is_displayed(self):
        if self.round_number < 3:
            return True
        else:
            return False


page_sequence = [Wait, Intermission, Game, ResultsWaitPage, ResultsPage]
