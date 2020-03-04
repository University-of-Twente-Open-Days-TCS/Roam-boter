import sys

from django.test import TestCase

from simulation.AINode import AINode
from dashboard.models import Team, Workshop

from .models import AI

from .converter import convert_aijson


TEST_CORRECT_JSON_PATH = "./AIapi/testjson/correct.json"
TEST_INCORRECT_JSON_PATH = "./AIapi/testjson/incorrect.json"

# Create your tests here.
class ConverterTest(TestCase):
    """Converter Test. Tests whether AI Json can be converted.
    It also tests for exceptions, because invalid user input should not be evaluated"""


    def setUp(self):

        correct_json_file = open(TEST_CORRECT_JSON_PATH, "r")
        incorrect_json_file = open(TEST_INCORRECT_JSON_PATH, "r")
        self.correct_json = correct_json_file.read()
        self.incorrect_json = incorrect_json_file.read()

    def test_correct_json(self):
        # Should not fail
        eval_tree = convert_aijson(self.correct_json)
        self.assertIsInstance(eval_tree, AINode)

    def test_incorrect_json(self):
        # Should throw an error
        with self.assertRaises(Exception):
            eval_tree = convert_aijson(self.incorrect_json)
            # Test that no tree has returned
            self.assertEquals(None, eval_tree)



class AIValidationTest(TestCase):
    """Test to check whether invalid AI's do not get saved to the database"""


    def setUp(self):

        correct_json_file = open(TEST_CORRECT_JSON_PATH, "r")
        incorrect_json_file = open(TEST_INCORRECT_JSON_PATH, "r")
        self.correct_json = correct_json_file.read()
        self.incorrect_json = incorrect_json_file.read()

        #create fake workshop
        workshop = Workshop.objects.create(workshop_open=True)
        #create fake team
        self.team = Team.objects.create(team_code=0, active=True, workshop=workshop)

    def test_valid_json(self):
        # should save to the database
        self.assertFalse(AI.objects.all().exists())
        ai = AI(team=self.team, aijson=self.correct_json)
        ai.save()
        self.assertTrue(AI.objects.all().exists())

    def test_invalid_json(self):
        # should not save to the database
        self.assertFalse(AI.objects.all().exists())
        ai = AI(team=self.team, aijson=self.incorrect_json)

        with self.assertRaises(Exception):
            ai.save()
            self.assertFalse(AI.objects.all().exists())
