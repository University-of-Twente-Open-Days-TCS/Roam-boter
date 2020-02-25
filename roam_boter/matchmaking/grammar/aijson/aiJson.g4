grammar aiJson;

startrule : LBR ai RBR EOF ;


ai      : AI SC info;
info    : LBR name COM creator_id COM root RBR ;

name        : NAME SC APHSTRING ;
creator_id  : CREATOR_ID SC INTEGER ; 

root        : ROOT SC node ;
node        : condition | actionblock;

condition   : LBR CONDITION SC conditiondata RBR ;
conditiondata : LBR type_id COM childtrue COM childfalse (COM attributes)? RBR ;
childtrue   : CHILDTRUE SC node ;
childfalse  : CHILDFALSE SC node ;






actionblock : LBR ACTIONBLOCK SC actionlist RBR ;
actionlist  : LB action (COM action)* RB ;
action      : LBR type_id (COM attributes)? RBR;


attributes          : ATTRIBUTES SC attributevalues ;
attributevalues     : LBR attributevalue (COM attributevalue)* RBR ;
attributevalue      : APHSTRING SC value;
value               : APHSTRING | INTEGER;

type_id     : TYPE_ID SC INTEGER ;






AI          : APH 'AI' APH ;
NAME        : APH 'name' APH ; 
CREATOR_ID  : APH 'creator-id' APH ;
ROOT        : APH 'root' APH ;
CONDITION   : APH 'condition' APH ;

CHILDTRUE   : APH 'child-true' APH ;
CHILDFALSE  : APH 'child-false' APH ;

ACTIONBLOCK : APH 'actionblock' APH ;

TYPE_ID     : APH 'type-id' APH ;
ATTRIBUTES  : APH 'attributes' APH ;
APHSTRING   : APH STRING APH;




INTEGER : DIGIT+ ;
STRING : ALPHANUMERIC+ ;
ALPHANUMERIC : CHAR | DIGIT ;

CHAR : [a-zA-Z] ;
DIGIT  : [0-9];

APH : '"';
COM : ',';
SC  : ':';
LBR : '{';
RBR : '}';
LB : '[';
RB : ']';

WS : [ \t\n]+ -> skip;